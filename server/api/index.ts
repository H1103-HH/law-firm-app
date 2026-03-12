import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { AppModule } from '../src/app.module';
import * as express from 'express';
import serverless from 'serverless-http';

let cachedServer: any;

async function bootstrap() {
  if (!cachedServer) {
    console.log('Initializing NestJS app...');
    const expressApp = express();

    try {
      const app = await NestFactory.create(
        AppModule,
        new ExpressAdapter(expressApp),
        { logger: ['error', 'warn', 'log'] }
      );

      app.enableCors({
        origin: '*',
        credentials: true,
      });

      app.use(express.json({ limit: '50mb' }));
      app.use(express.urlencoded({ limit: '50mb', extended: true }));

      await app.init();
      console.log('NestJS app initialized successfully');

      // 使用 serverless-http 包装 Express 应用
      cachedServer = serverless(expressApp);
    } catch (error) {
      console.error('Failed to initialize NestJS app:', error);
      throw error;
    }
  }

  return cachedServer;
}

export default async function handler(req: any, res: any) {
  console.log(`Request: ${req.method} ${req.url}`);
  try {
    const server = await bootstrap();
    return server(req, res);
  } catch (error) {
    console.error('Handler error:', error);
    res.status(500).json({
      code: 500,
      msg: 'Internal Server Error',
      error: error.message
    });
  }
}
