import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Permission, Role } from './entities';
import { DataSource, In, Repository } from 'typeorm';
import { SimplePaginationDto } from '../common/dtos/pagination.dto';
import { generatePagination } from '../common/utils';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(Role)
    private readonly permissionRepository: Repository<Permission>,
    private readonly dataSource: DataSource,
  ) {}

  getDataSource(): DataSource {
    return this.dataSource;
  }

  async create(createRoleDto: CreateRoleDto) {
    let permissions = [];

    if (createRoleDto.permissions?.length > 0) {
      permissions = await this.permissionRepository.find({
        where: {
          id: In(createRoleDto.permissions),
        },
      });
    }

    const role = this.roleRepository.create({
      ...createRoleDto,
      permissions,
    });

    await this.roleRepository.save(role);

    return role;
  }

  async findAll(paginationDto: SimplePaginationDto) {
    // const { limit = 10, offset = 0 } = paginationDto;
    const { page = 10, perPage = 0 } = paginationDto;
    const { pagination, offset } = generatePagination<Role>(page, perPage);

    const [roles, total] = await this.roleRepository.findAndCount({
      take: pagination.perPage,
      skip: offset,
      relations: {
        permissions: true,
      },
    });

    pagination.data = roles;
    pagination.total = total;

    return pagination;
  }

  async findOne(id: number) {
    const role = await this.roleRepository.findOneBy({ id });

    if (!role) throw new NotFoundException(`Role with ${id} not found`);

    return role;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  update(id: number, updateRoleDto: UpdateRoleDto) {
    return `This action updates a #${id} role`;
  }

  async remove(id: number) {
    const role = await this.findOne(id);
    await this.roleRepository.remove(role);
  }
}
