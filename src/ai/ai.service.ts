import { Injectable } from '@nestjs/common'
import OpenAI from 'openai'

export interface LeadSummaryResult {
  summary: string
  nextAction: string
}

@Injectable()
export class AiService {
  private readonly enabled = process.env.AI_ENABLED === 'true'

  private client?: OpenAI

  constructor() {
    if (this.enabled) {
      this.client = new OpenAI({
        apiKey: process.env.AI_API_KEY
      })
    }
  }

  async generateLeadSummary(lead: any): Promise<LeadSummaryResult> {
    try {
      if (!this.enabled || !this.client) return this.fallbackSummary(lead)

      return await this.openAiSummary(lead)
    } catch (error) {
      return this.fallbackSummary(lead)
    }
  }

  private async openAiSummary(lead: any): Promise<LeadSummaryResult> {
    const prompt = `
    You are a CRM assistant.

    Given the following lead information, generate:
    1. A short summary (max 3 lines)
    2. A concrete next action

    Lead:
    Name: ${lead.firstName} ${lead.lastName}
    Email: ${lead.email}
    Phone: ${lead.phone}

    Return the result as JSON with keys:
    - summary
    - nextAction
    `

    const response = await this.client!.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }]
    })

    const content = response.choices[0].message.content

    return JSON.parse(content!)
  }

  private fallbackSummary(lead: any): LeadSummaryResult {
    return {
      summary: `Lead ${lead.firstName} ${lead.lastName} with email ${lead.email}`,
      nextAction: 'Contact lead via email to schedule a follow-up'
    }
  }
}
