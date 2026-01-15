import { Module } from '@nestjs/common'
import { APP_GUARD } from '@nestjs/core'
import { BullModule } from '@nestjs/bull'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ScheduleModule } from '@nestjs/schedule'
import { CacheModule } from '@nestjs/cache-manager'
import * as redisStore from 'cache-manager-redis-store'
import { ConfigModule, ConfigService } from '@nestjs/config'

import { AiModule } from './ai/ai.module'
import { SyncModule } from './sync/sync.module'
import { LeadsModule } from './leads/leads.module'
import { Lead } from './leads/entities/lead.entity'
import { ApiKeyGuard } from './common/guards/api-key.guard'

@Module({
  providers: [
    {
      provide: APP_GUARD,
      useClass: ApiKeyGuard
    }
  ],
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('DB_HOST'),
        port: config.get<number>('DB_PORT'),
        username: config.get<string>('DB_USER'),
        password: config.get<string>('DB_PASSWORD'),
        database: config.get<string>('DB_NAME'),

        entities: [Lead],
        synchronize: true,
        logging: false
      })
    }),
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: () => ({
        store: redisStore,
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT,
        ttl: 60
      })
    }),
    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 6379,
        maxRetriesPerRequest: null
      }
    }),
    ScheduleModule.forRoot(),
    AiModule,
    SyncModule,
    LeadsModule,
  ]
})
export class AppModule {}
