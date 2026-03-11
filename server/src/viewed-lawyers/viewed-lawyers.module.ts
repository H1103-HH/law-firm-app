import { Module } from '@nestjs/common'
import { ViewedLawyersController } from './viewed-lawyers.controller'
import { ViewedLawyersService } from './viewed-lawyers.service'

@Module({
  controllers: [ViewedLawyersController],
  providers: [ViewedLawyersService],
  exports: [ViewedLawyersService],
})
export class ViewedLawyersModule {}
