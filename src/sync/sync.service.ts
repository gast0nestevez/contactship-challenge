import { Injectable } from '@nestjs/common'
import { Cron } from '@nestjs/schedule'
import { InjectQueue } from '@nestjs/bull'
import type { Queue } from 'bull'

@Injectable()
export class SyncService {
  constructor(
    @InjectQueue('sync-leads')
    private readonly syncQueue: Queue
  ) {}

  @Cron('0 */5 * * * *') // cada 5 minutos
  async syncLeads() {
    console.log('[CRON] Sync triggered')
    await this.syncQueue.add({})
  }
}
