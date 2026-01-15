import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { LeadsController } from './leads.controller'
import { LeadsService } from './leads.service'
import { Lead } from './entities/lead.entity'
import { AiService } from 'src/ai/ai.service'

@Module({
  imports: [TypeOrmModule.forFeature([Lead])],
  controllers: [LeadsController],
  providers: [LeadsService, AiService],
  exports: [LeadsService]
})
export class LeadsModule {}
