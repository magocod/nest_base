import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';

import { AuthModule } from './auth.module';
import { configBaseModules } from '../app.module';
import { AdminCreateUserDto, AdminUpdateUserDto } from './dto';
import { faker } from '@faker-js/faker';
import {
  generateRole,
  generateUser,
  generatePassword,
} from '../../test/fixtures';
import { TypeORMError } from 'typeorm';
import { SimplePaginationDto } from '../common/dtos/pagination.dto';
import { DEFAULT_LIMIT_PAGINATION, PaginationKeys } from '../common/utils';
import {
  basicPagination,
  // sortObjectStringify,
  TESTING_DEFAULT_PAGINATION,
} from '../../test/helpers';
import { User } from './entities';
import { NotFoundException } from '@nestjs/common';

describe('UsersService', () => {
  let service: UsersService;
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [...configBaseModules(), AuthModule],
      providers: [UsersService],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  afterEach(async () => {
    await module.close();
  });

  describe('create', function () {
    it('only required data', async () => {
      const data: AdminCreateUserDto = {
        email: faker.internet.email(),
        fullName: faker.name.fullName(),
        password: generatePassword(),
      };
      const user = await service.create(data);

      expect(user.id).toBeDefined();
      expect(user.email).toEqual(data.email.toLowerCase());
      expect(user.fullName).toEqual(data.fullName);
      expect(user.password).toBeUndefined();
    });

    it('with optional data', async () => {
      const role = await generateRole(service.getDataSource());
      const data: AdminCreateUserDto = {
        email: faker.internet.email(),
        fullName: faker.name.fullName(),
        password: generatePassword(),
        isActive: faker.datatype.boolean(),
        roles: [role.id],
      };
      const user = await service.create(data);

      expect(user.id).toBeDefined();
      expect(user.email).toEqual(data.email.toLowerCase());
      expect(user.fullName).toEqual(data.fullName);
      expect(user.password).toBeUndefined();
      expect(user.isActive).toEqual(data.isActive);
      expect(
        user.roles.every((p) => {
          return data.roles.includes(p.id);
        }),
      ).toEqual(true);
    });

    it('invalid data', async () => {
      const data = {} as AdminCreateUserDto;
      try {
        await service.create(data);
      } catch (e) {
        expect(e).toBeInstanceOf(TypeError);
      }
    });

    it('duplicate email', async () => {
      const { user } = await generateUser(service.getDataSource());
      const data: AdminCreateUserDto = {
        email: user.email,
        fullName: faker.name.fullName(),
        password: generatePassword(),
      };
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
      const { user } = await generateUser(service.getDataSource());
      const foundUser = await service.findOne(user.id);

      expect(foundUser.id).toEqual(user.id);
      expect(foundUser).toBeInstanceOf(User);
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
      const { user } = await generateUser(service.getDataSource());
      const data: AdminUpdateUserDto = {
        email: faker.internet.email(),
        fullName: faker.name.fullName(),
      };
      const userUpdated = await service.update(user.id, data);

      expect(userUpdated.id).toBeDefined();
      expect(userUpdated.email).toEqual(data.email.toLowerCase());
      expect(userUpdated.fullName).toEqual(data.fullName);
      expect(userUpdated.password).toBeUndefined();
    });

    it('with optional data', async () => {
      const { user } = await generateUser(service.getDataSource());
      const role = await generateRole(service.getDataSource());
      const data: AdminCreateUserDto = {
        email: faker.internet.email(),
        fullName: faker.name.fullName(),
        password: generatePassword(),
        isActive: faker.datatype.boolean(),
        roles: [role.id],
      };
      const userUpdated = await service.update(user.id, data);

      expect(userUpdated.id).toEqual(user.id);
      expect(userUpdated.email).toEqual(data.email.toLowerCase());
      expect(userUpdated.fullName).toEqual(data.fullName);
      expect(userUpdated.password).toBeUndefined();
      expect(userUpdated.isActive).toEqual(data.isActive);
      expect(
        userUpdated.roles.every((p) => {
          return data.roles.includes(p.id);
        }),
      ).toEqual(true);
    });

    // it('empty data', async () => {
    //   const { user } = await generateUser(service.getDataSource());
    //   delete user.password
    //   const data = {} as AdminUpdateUserDto;
    //   try {
    //     await service.update(user.id, data);
    //   } catch (e) {
    //     expect(e).toBeInstanceOf(TypeORMError);
    //   }
    //   const userDb = await service
    //     .getRepository()
    //     .findOne({ where: { id: user.id } });
    //
    //   expect(sortObjectStringify(user)).toEqual(sortObjectStringify(userDb));
    // });

    it('not found', async () => {
      const data = {} as AdminUpdateUserDto;
      try {
        await service.update(-1, data);
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
      }
    });

    it('duplicate email', async () => {
      const { user } = await generateUser(service.getDataSource());
      const other = await generateUser(service.getDataSource());
      const data: AdminUpdateUserDto = {
        email: other.user.email,
        fullName: faker.name.fullName(),
      };
      try {
        await service.update(user.id, data);
      } catch (e) {
        expect(e).toBeInstanceOf(TypeORMError);
      }
      const userDb = await service
        .getRepository()
        .findOne({ where: { id: user.id } });

      expect(userDb.email).toEqual(user.email);
      expect(userDb.fullName).toEqual(user.fullName);
      expect(userDb.isActive).toEqual(user.isActive);
    });
  });

  describe('delete', function () {
    it('valid param', async () => {
      const { user } = await generateUser(service.getDataSource());
      const role = await service.remove(user.id);

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
