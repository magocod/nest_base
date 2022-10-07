import { Injectable } from '@nestjs/common';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { SimplePaginationDto } from '../common/dtos/pagination.dto';
import { generatePagination } from '../common/utils';
import { Permission } from './entities';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
    private readonly dataSource: DataSource,
  ) {}

  getDataSource(): DataSource {
    return this.dataSource;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  create(createPermissionDto: CreatePermissionDto) {
    return 'This action adds a new permission';
  }

  async findAll(paginationDto: SimplePaginationDto) {
    // const { limit = 10, offset = 0 } = paginationDto;
    const { page = 10, perPage = 0 } = paginationDto;
    const { pagination, offset } = generatePagination<Permission>(
      page,
      perPage,
    );

    const [roles, total] = await this.permissionRepository.findAndCount({
      take: pagination.perPage,
      skip: offset,
    });

    pagination.data = roles;
    pagination.total = total;

    return pagination;
  }

  findOne(id: number) {
    return `This action returns a #${id} permission`;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  update(id: number, updatePermissionDto: UpdatePermissionDto) {
    return `This action updates a #${id} permission`;
  }

  remove(id: number) {
    return `This action removes a #${id} permission`;
  }
}
