import {
  Controller,
  Post,
  Get,
  Param,
  Body
} from '@nestjs/common'

import { LeadsService } from './leads.service'
import { CreateLeadDto } from './dto/create-lead.dto'

@Controller()
export class LeadsController {
  constructor(private readonly leadsService: LeadsService) {}

  @Post('create-lead')
  createLead(@Body() dto: CreateLeadDto) {
    return this.leadsService.createManualLead(dto)
  }

  @Get('leads')
  getLeads() {
    return this.leadsService.getAll()
  }

  @Get('leads/:id')
  getLeadById(@Param('id') id: string) {
    return this.leadsService.getById(id)
  }

  @Post('leads/:id/summarize')
  summarizeLead(@Param('id') id: string) {
    return this.leadsService.summarizeLead(id)
  }
}
