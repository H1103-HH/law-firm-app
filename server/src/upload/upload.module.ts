import { Module } from '@nestjs/common';
import { UploadController } from './upload.controller';
import { MulterModule } from '@nestjs/platform-express';
import * as multer from 'multer';

@Module({
  imports: [
    MulterModule.register({
      storage: multer.memoryStorage(), // 使用内存存储
      limits: { fileSize: 5 * 1024 * 1024 }, // 限制 5MB
    }),
  ],
  controllers: [UploadController],
})
export class UploadModule {}
