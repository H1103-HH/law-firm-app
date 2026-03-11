import { Module } from '@nestjs/common';
import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';
import { ConsultationsModule } from './consultations/consultations.module';
import { AuthModule } from './auth/auth.module';
import { LawyerModule } from './lawyer/lawyer.module';
import { AdminModule } from './admin/admin.module';
import { UploadModule } from './upload/upload.module';
import { ViewedLawyersModule } from './viewed-lawyers/viewed-lawyers.module';

@Module({
  imports: [ConsultationsModule, AuthModule, LawyerModule, AdminModule, UploadModule, ViewedLawyersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
