import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RolesService } from './roles.service';
import { CreateRoleDto, UpdateRoleDto } from './dto';
import { SimplePaginationDto } from '../common/dtos';
import { Auth } from './decorators';
import { PermissionNames } from './interfaces';
import { ApiVersion } from '../app.constants';

@ApiTags('Auth_roles')
@Controller({ path: 'roles', version: ApiVersion.v1 })
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Auth(PermissionNames.USER)
  @Post()
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.rolesService.create(createRoleDto);
  }

  @Auth(PermissionNames.USER)
  @Get()
  findAll(@Query() paginationDto: SimplePaginationDto) {
    return this.rolesService.findAll(paginationDto);
  }

  @Auth(PermissionNames.USER)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.rolesService.findOne(+id);
  }

  @Auth(PermissionNames.USER)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.rolesService.update(+id, updateRoleDto);
  }

  @Auth(PermissionNames.USER)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.rolesService.remove(+id);
  }
}
