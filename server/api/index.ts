import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { AppModule } from '../src/app.module';
import * as express from 'express';
import serverless from 'serverless-http';

let cachedServer: any;

async function bootstrap() {
  if (!cachedServer) {
    console.log('[Bootstrap] Initializing NestJS app...');
    const expressApp = express();

    try {
      console.log('[Bootstrap] Creating NestJS application...');
      const app = await NestFactory.create(
        AppModule,
        new ExpressAdapter(expressApp),
        { logger: ['error', 'warn', 'log', 'debug'] }
      );

      console.log('[Bootstrap] Enabling CORS...');
      app.enableCors({
        origin: '*',
        credentials: true,
      });

      console.log('[Bootstrap] Configuring middleware...');
      app.use(express.json({ limit: '50mb' }));
      app.use(express.urlencoded({ limit: '50mb', extended: true }));

      console.log('[Bootstrap] Initializing NestJS app...');
      await app.init();
      console.log('[Bootstrap] NestJS app initialized successfully');

      // 使用 serverless-http 包装 Express 应用
      console.log('[Bootstrap] Wrapping with serverless-http...');
      cachedServer = serverless(expressApp);
      console.log('[Bootstrap] Server wrapped successfully');
    } catch (error) {
      console.error('[Bootstrap] Failed to initialize NestJS app:', error);
      throw error;
    }
  }

  return cachedServer;
}

export default async function handler(req: any, res: any) {
  const startTime = Date.now();
  console.log(`[Handler] ${req.method} ${req.url} - Start`);

  try {
    const server = await bootstrap();
    console.log(`[Handler] Bootstrap took ${Date.now() - startTime}ms`);

    return server(req, res);
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error(`[Handler] Error after ${duration}ms:`, error);
    console.error('[Handler] Error stack:', error.stack);

    res.status(500).json({
      code: 500,
      msg: 'Internal Server Error',
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}
