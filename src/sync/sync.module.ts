import { Module } from '@nestjs/common'
import { BullModule } from '@nestjs/bull'

import { SyncService } from './sync.service'
import { SyncProcessor } from './sync.processor'
import { LeadsModule } from '../leads/leads.module'
import { RandomUserModule } from '../integrations/random-user/random-user.module'

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'sync-leads'
    }),
    LeadsModule,
    RandomUserModule
  ],
  providers: [SyncService, SyncProcessor]
})
export class SyncModule {}
