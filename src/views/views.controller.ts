import { Controller, Get } from '@nestjs/common';
import { ViewsService } from './views.service';
@Controller('views')
export class ViewsController {
  constructor(private readonly viewsService: ViewsService) {}
  @Get()
  findAll() {
    return this.viewsService.findAll();
  }
}
