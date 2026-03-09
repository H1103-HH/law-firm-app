import { Controller, Post, HttpCode, HttpException, HttpStatus } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UseInterceptors, UploadedFile } from '@nestjs/common';
import { S3Storage } from 'coze-coding-dev-sdk';

@Controller('upload')
export class UploadController {
  private storage: S3Storage;

  constructor() {
    // 初始化对象存储
    this.storage = new S3Storage({
      bucketName: process.env.COZE_BUCKET_NAME,
      region: 'cn-beijing',
    });
  }

  @Post()
  @HttpCode(200)
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    try {
      console.log('上传文件:', {
        originalname: file.originalname,
        mimetype: file.mimetype,
        size: file.buffer?.length || 0,
      });

      if (!file || !file.buffer) {
        throw new HttpException(
          { code: 400, msg: '文件内容为空', data: null },
          HttpStatus.BAD_REQUEST,
        );
      }

      // 上传到对象存储
      const fileKey = await this.storage.uploadFile({
        fileContent: file.buffer,
        fileName: `avatars/${file.originalname}`,
        contentType: file.mimetype,
      });

      console.log('文件上传成功:', fileKey);

      // 生成可访问的 URL（有效期 1 天）
      const imageUrl = await this.storage.generatePresignedUrl({
        key: fileKey,
        expireTime: 86400,
      });

      return {
        code: 200,
        msg: '上传成功',
        data: {
          fileKey,
          imageUrl,
        },
      };
    } catch (error) {
      console.error('文件上传失败:', error);
      throw new HttpException(
        {
          code: 500,
          msg: error.message || '文件上传失败',
          data: null,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
