import { Controller, Get } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { AppService } from './app.service';
import { Public } from '@/modules/shared/decorators';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly dataSource: DataSource,
  ) {}

  @Get()
  @Public()
  getHello(): { message: string } {
    return this.appService.getHello();
  }

  @Get('health')
  @Public()
  async healthCheck() {
    const checks: Record<string, { status: string }> = {};

    try {
      await this.dataSource.query('SELECT 1');
      checks.database = { status: 'ok' };
    } catch {
      checks.database = { status: 'error' };
    }

    return {
      status: Object.values(checks).every((c) => c.status === 'ok')
        ? 'ok'
        : 'error',
      timestamp: new Date().toISOString(),
      checks,
    };
  }
}
