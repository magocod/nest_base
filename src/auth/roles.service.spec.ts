import { Test, TestingModule } from '@nestjs/testing';
import { TypeORMError } from 'typeorm';

import { faker } from '@faker-js/faker';
import { RolesService } from './roles.service';
import { AuthModule } from './auth.module';
import { configBaseModules, postgresConfig } from '../app.module';
import { CreateRoleDto, UpdateRoleDto } from './dto';

import { upsertPermission, generateRole } from '../../test/fixtures';
import {
  basicPagination,
  TESTING_DEFAULT_PAGINATION,
  sortObjectStringify,
} from '../../test/helpers';
import { Permission, Role } from './entities';
import { SimplePaginationDto } from '../common/dtos/pagination.dto';
import { DEFAULT_LIMIT_PAGINATION, PaginationKeys } from '../common/utils';
import { NotFoundException } from '@nestjs/common';

describe('RolesService', () => {
  let service: RolesService;
  let module: TestingModule;
  let permissions: Permission[] = [];

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [...configBaseModules(postgresConfig), AuthModule],
      providers: [RolesService],
    }).compile();

    service = module.get<RolesService>(RolesService);
    permissions = await upsertPermission(service.getDataSource());
  });

  afterEach(async () => {
    await module.close();
  });

  describe('create', function () {
    it('only required data', async () => {
      const data: CreateRoleDto = {
        name: faker.animal.insect(),
        description: faker.datatype.uuid(),
      };
      const role = await service.create(data);

      expect(role.id).toBeDefined();
      expect(role.name).toEqual(data.name);
      expect(role.description).toEqual(data.description);
    });

    it('with optional data', async () => {
      const data: CreateRoleDto = {
        name: faker.animal.insect(),
        description: faker.datatype.uuid(),
        isActive: faker.datatype.boolean(),
        permissions: permissions.slice(0, 2).map((p) => {
          return p.id;
        }),
      };
      const role = await service.create(data);

      expect(role.id).toBeDefined();
      expect(role.name).toEqual(data.name);
      expect(role.description).toEqual(data.description);
      expect(role.isActive).toEqual(data.isActive);
      expect(
        role.permissions.every((p) => {
          return data.permissions.includes(p.id);
        }),
      ).toEqual(true);
    });

    it('invalid data', async () => {
      const data = {} as CreateRoleDto;
      try {
        await service.create(data);
      } catch (e) {
        expect(e).toBeInstanceOf(TypeORMError);
      }
    });
  });

  describe('findAll', function () {
    it('unfiltered', async () => {
      const qs: SimplePaginationDto = {};
      const pagination = await service.findAll(qs);

      expect(Object.keys(pagination)).toEqual(PaginationKeys);
      expect(pagination.page).toEqual(1);
      expect(pagination.perPage).toEqual(DEFAULT_LIMIT_PAGINATION);
    });

    it('paginate', async () => {
      const qs = basicPagination();
      qs.perPage = TESTING_DEFAULT_PAGINATION;
      const pagination = await service.findAll(qs);

      expect(Object.keys(pagination)).toEqual(PaginationKeys);
      expect(pagination.page).toEqual(1);
      expect(pagination.perPage).toEqual(TESTING_DEFAULT_PAGINATION);
    });
  });

  describe('findOne', function () {
    it('valid param', async () => {
      const { id } = await generateRole(service.getDataSource());
      const role = await service.findOne(id);

      expect(role.id).toEqual(id);
      expect(role).toBeInstanceOf(Role);
    });

    it('invalid param', async () => {
      try {
        await service.findOne('invalid' as unknown as number);
      } catch (e) {
        expect(e).toBeInstanceOf(TypeORMError);
      }
    });

    it('not found', async () => {
      try {
        await service.findOne(-1);
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
      }
    });
  });

  describe('update', function () {
    it('only required data', async () => {
      const { id } = await generateRole(service.getDataSource());
      const data: UpdateRoleDto = {
        name: faker.animal.insect(),
        description: faker.datatype.uuid(),
      };
      const role = await service.update(id, data);

      expect(role.id).toEqual(id);
      expect(role.name).toEqual(data.name);
      expect(role.description).toEqual(data.description);
    });

    it('with optional data', async () => {
      const { id } = await generateRole(service.getDataSource());
      const data: UpdateRoleDto = {
        name: faker.animal.insect(),
        description: faker.datatype.uuid(),
        isActive: faker.datatype.boolean(),
        permissions: permissions.slice(0, 2).map((p) => {
          return p.id;
        }),
      };
      const role = await service.update(id, data);

      expect(role.id).toEqual(id);
      expect(role.name).toEqual(data.name);
      expect(role.description).toEqual(data.description);
      expect(role.isActive).toEqual(data.isActive);
      expect(
        role.permissions.every((p) => {
          return data.permissions.includes(p.id);
        }),
      ).toEqual(true);
    });

    it('empty data', async () => {
      const role = await generateRole(service.getDataSource());
      const data = {} as UpdateRoleDto;
      try {
        await service.update(role.id, data);
      } catch (e) {
        expect(e).toBeInstanceOf(TypeORMError);
      }
      const roleDb = await service
        .getRepository()
        .findOne({ where: { id: role.id } });

      expect(sortObjectStringify(role)).toEqual(sortObjectStringify(roleDb));
    });

    it('not found', async () => {
      const data = {} as UpdateRoleDto;
      try {
        await service.update(-1, data);
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
      }
    });
  });

  describe('delete', function () {
    it('valid param', async () => {
      const { id } = await generateRole(service.getDataSource());
      const role = await service.remove(id);

      expect(role).toBeUndefined();
    });

    it('invalid param', async () => {
      try {
        await service.remove('invalid' as unknown as number);
      } catch (e) {
        expect(e).toBeInstanceOf(TypeORMError);
      }
    });

    it('not found', async () => {
      try {
        await service.remove(-1);
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
      }
    });
  });
});
