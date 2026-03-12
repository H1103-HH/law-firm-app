import { Controller, Get } from '@nestjs/common';

@Controller('health')
export class HealthController {
  @Get()
  check() {
    return {
      code: 200,
      msg: 'success',
      data: {
        status: 'ok',
        timestamp: new Date().toISOString(),
      },
    };
  }
}
