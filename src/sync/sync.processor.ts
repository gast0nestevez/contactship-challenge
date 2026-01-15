import type { Job } from 'bull'
import { Processor, Process } from '@nestjs/bull'

import { LeadsService } from '../leads/leads.service'
import { RandomUserService } from '../integrations/random-user/random-user.service'
import { mapRandomUserToLead } from '../integrations/random-user/random-user.mapper'

@Processor('sync-leads')
export class SyncProcessor {
  constructor(
    private readonly leadsService: LeadsService,
    private readonly randomUserService: RandomUserService
  ) {}

  @Process()
  async handleSync(job: Job) {
    const users = await this.randomUserService.fetchUsers(10)

    for (const user of users) {
      try {
        const leadData = mapRandomUserToLead(user)
        await this.leadsService.createExternalLead(leadData)
      } catch (error) {
        // duplicados se ignoran
      }
    }
  }
}
