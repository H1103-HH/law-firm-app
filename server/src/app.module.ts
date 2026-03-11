import { Module } from '@nestjs/common';
import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';
import { AuthModule } from './auth/auth.module';
import { LawyerModule } from './lawyer/lawyer.module';
import { AdminModule } from './admin/admin.module';
import { UploadModule } from './upload/upload.module';
import { ViewedLawyersModule } from './viewed-lawyers/viewed-lawyers.module';
import { SavedCardsModule } from './saved-cards/saved-cards.module';

@Module({
  imports: [AuthModule, LawyerModule, AdminModule, UploadModule, ViewedLawyersModule, SavedCardsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
