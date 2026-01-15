import { Module } from '@nestjs/common'
import { RandomUserService } from './random-user.service'

@Module({
  providers: [RandomUserService],
  exports: [RandomUserService]
})
export class RandomUserModule {}
