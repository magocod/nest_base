import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Version,
} from '@nestjs/common';
import { CatsService } from './cats.service';
import { CreateCatDto, PaginationCatDto, UpdateCatDto } from './dto';
import { ApiTags } from '@nestjs/swagger';
import { ApiVersion } from '../app.constants';
import { PaginationMongoDto } from '../common/dtos';

@ApiTags('Cats')
@Controller({ path: 'cats', version: ApiVersion.v1 })
export class CatsController {
  constructor(private readonly catsService: CatsService) {}

  @Post()
  create(@Body() createCatDto: CreateCatDto) {
    return this.catsService.create(createCatDto);
  }

  @Get()
  findAll(@Query() paginationDto: PaginationMongoDto) {
    return this.catsService.findAll(paginationDto);
  }

  @Version(ApiVersion.v2)
  @Get()
  findAllAggregate(@Query() paginationDto: PaginationCatDto) {
    return this.catsService.findAllAggregate(paginationDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.catsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCatDto: UpdateCatDto) {
    return this.catsService.update(+id, updateCatDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.catsService.remove(+id);
  }
}
