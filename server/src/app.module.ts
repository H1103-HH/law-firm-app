import { Module } from '@nestjs/common';
import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';
import { ConsultationsModule } from './consultations/consultations.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [ConsultationsModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
