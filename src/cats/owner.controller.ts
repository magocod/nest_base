import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApiVersion } from '../app.constants';
import { OwnerService } from './owner.service';
import { PaginationOwnerDto } from './dto';

@ApiTags('Owners')
@Controller({ path: 'owners', version: ApiVersion.v1 })
export class OwnerController {
  constructor(private readonly ownerService: OwnerService) {}

  @Get()
  findAll(@Query() paginationDto: PaginationOwnerDto) {
    return this.ownerService.findAll(paginationDto);
  }
}
