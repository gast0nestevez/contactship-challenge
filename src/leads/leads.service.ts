import {
  Injectable,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
  Inject
} from '@nestjs/common'
import { Repository } from 'typeorm'
import type { Cache } from 'cache-manager'
import { InjectRepository } from '@nestjs/typeorm'
import { CACHE_MANAGER } from '@nestjs/cache-manager'

import { AiService } from 'src/ai/ai.service'
import { Lead } from './entities/lead.entity'
import { CreateLeadDto } from './dto/create-lead.dto'

@Injectable()
export class LeadsService {
  constructor(
    @InjectRepository(Lead)
    private readonly leadRepository: Repository<Lead>,

    private readonly aiService: AiService,
    
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache
  ) {}


  async createManualLead(dto: CreateLeadDto) {
    try {
      const lead = this.leadRepository.create({
        ...dto,
        source: 'manual'
      })

      return await this.leadRepository.save(lead)
    } catch (error: any) {
      // PostgreSQL unique violation
      if (error.code === '23505') throw new ConflictException(`Lead with email ${dto.email} already exists`)

      throw new InternalServerErrorException('Failed to create lead')
    }
  }

  async getAll() {
    return this.leadRepository.find()
  }

  async getById(id: string) {
    const cacheKey = `lead:${id}`

    // 1. intento cache
    const cachedLead = await this.cacheManager.get<Lead>(cacheKey)
    if (cachedLead) return cachedLead

    // 2. DB
    const lead = await this.leadRepository.findOneBy({ id })
    if (!lead) throw new NotFoundException('Lead not found')

    // 3. guardar en cache
    await this.cacheManager.set(cacheKey, lead, 60)

    return lead
  }

  async summarizeLead(id: string) {
    const lead = await this.leadRepository.findOneBy({ id })

    if (!lead) throw new NotFoundException('Lead not found')

    // 1. generar summary con IA
    const { summary, nextAction } = await this.aiService.generateLeadSummary(lead)

    // 2. persistir
    lead.summary = summary
    lead.nextAction = nextAction

    await this.leadRepository.save(lead)

    // 3. invalidar cache
    await this.cacheManager.del(`lead:${id}`)

    // 4. responder estrictamente el formato pedido
    return {
      summary,
      nextAction
    }
  }

  async createExternalLead(data: Partial<Lead>) {
    const lead = this.leadRepository.create(data)

    try {
      return await this.leadRepository.save(lead)
    } catch (error: any) {
      if (error.code === '23505') {
        // duplicado -> ignorar
        return null
      }
      throw error
    }
  }
}
