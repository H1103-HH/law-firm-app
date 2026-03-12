import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { AppModule } from '../src/app.module';
import * as express from 'express';

let cachedApp: any;

const bootstrap = async () => {
  if (!cachedApp) {
    const expressApp = express();
    const app = await NestFactory.create(
      AppModule,
      new ExpressAdapter(expressApp)
    );

    app.enableCors({
      origin: true,
      credentials: true,
    });

    // 移除全局前缀，由 Vercel Serverless Function 处理 /api 路径
    // app.setGlobalPrefix('api');
    app.use(express.json({ limit: '50mb' }));
    app.use(express.urlencoded({ limit: '50mb', extended: true }));

    await app.init();
    cachedApp = expressApp;
  }

  return cachedApp;
};

export default async (req: any, res: any) => {
  const app = await bootstrap();
  app(req, res);
};
