import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Public } from '@/modules/shared';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Public()
  getHello(): { message: string } {
    return this.appService.getHello();
  }

  @Get('health')
  @Public()
  healthCheck() {
    return {
      service: 'proyect-backend',
      version: '1.0.0',
    };
  }
}
