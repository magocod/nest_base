import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiVersion } from './app.constants';

@Controller({ version: ApiVersion.v1 })
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
