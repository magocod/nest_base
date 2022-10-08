import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { validate } from 'class-validator';

import supertest from 'supertest';
import * as request from 'supertest';
import { faker } from '@faker-js/faker';
import { AppModule, globalPrefix, configApp } from './../../src/app.module';
import { AppService } from './../../src/app.service';
import { CreateRoleDto, UpdateRoleDto } from './../../src/auth/dto';

import {
  generateUser,
  generateAuthHeader,
  generateRole,
  upsertPermission,
  generateUserWith,
} from '../fixtures';
import { Permission, Role } from '../../src/auth/entities';
import { SimplePaginationDto } from '../../src/common/dtos/pagination.dto';
import {
  DEFAULT_LIMIT_PAGINATION,
  PaginationKeys,
} from '../../src/common/utils';
import {
  basicPagination,
  sortObjectStringify,
  TESTING_DEFAULT_PAGINATION,
  addQueryString,
  QueryString,
} from '../helpers';
import { PermissionNames } from '../../src/auth/interfaces';

const baseRoute = `/${globalPrefix}/roles`;

describe('Roles - /roles (e2e)', () => {
  let app: INestApplication;
  let service: AppService;
  let jwtService: JwtService;
  let httpClient: supertest.SuperTest<supertest.Test>;
  let permissions: Permission[] = [];

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    service = moduleFixture.get<AppService>(AppService);
    jwtService = moduleFixture.get<JwtService>(JwtService);

    app = moduleFixture.createNestApplication();
    configApp(app);

    await app.init();
    httpClient = request(app.getHttpServer());

    permissions = await upsertPermission(service.getDataSource());
  });

  afterAll(async () => {
    await app.close();
  });

  describe('create', function () {
    it('only required data', async () => {
      const { user } = await generateUserWith(service.getDataSource(), {
        permissions: permissions.filter((p) => {
          return p.name === PermissionNames.USER;
        }),
      });
      const data: CreateRoleDto = {
        name: faker.animal.insect(),
        description: faker.datatype.uuid(),
      };
      const res = await httpClient
        .post(baseRoute)
        .set('Authorization', generateAuthHeader(user, jwtService).authHeader)
        .send(data);

      expect(res.status).toEqual(201);

      expect(res.body.id).toBeDefined();
      expect(res.body.name).toEqual(data.name);
      expect(res.body.description).toEqual(data.description);
    });

    it('with optional data', async () => {
      const { user } = await generateUserWith(service.getDataSource(), {
        permissions: permissions.filter((p) => {
          return p.name === PermissionNames.USER;
        }),
      });
      const data: CreateRoleDto = {
        name: faker.animal.insect(),
        description: faker.datatype.uuid(),
        isActive: faker.datatype.boolean(),
        permissions: permissions.slice(0, 2).map((p) => {
          return p.id;
        }),
      };
      const res = await httpClient
        .post(baseRoute)
        .set('Authorization', generateAuthHeader(user, jwtService).authHeader)
        .send(data);

      expect(res.body.id).toBeDefined();
      expect(res.body.name).toEqual(data.name);
      expect(res.body.description).toEqual(data.description);
      expect(res.body.isActive).toEqual(data.isActive);
      expect(
        res.body.permissions.every((p) => {
          return data.permissions.includes(p.id);
        }),
      ).toEqual(true);
    });

    it('invalid data', async () => {
      const { user } = await generateUserWith(service.getDataSource(), {
        permissions: permissions.filter((p) => {
          return p.name === PermissionNames.USER;
        }),
      });
      const data = {} as CreateRoleDto;
      const validation = await validate(new CreateRoleDto());

      const res = await httpClient
        .post(baseRoute)
        .set('Authorization', generateAuthHeader(user, jwtService).authHeader)
        .send(data);

      expect(res.status).toEqual(400);
      expect(res.body.message).toEqual(
        validation.flatMap((v) => {
          return Object.values(v.constraints);
        }),
      );
    });
  });

  describe('findAll', function () {
    it('unfiltered', async () => {
      const { user } = await generateUserWith(service.getDataSource(), {
        permissions: permissions.filter((p) => {
          return p.name === PermissionNames.USER;
        }),
      });
      await generateRole(service.getDataSource());

      const res = await httpClient
        .get(baseRoute)
        .set('Authorization', generateAuthHeader(user, jwtService).authHeader);

      expect(res.status).toEqual(200);
      expect(Object.keys(res.body)).toEqual(PaginationKeys);
      expect(res.body.page).toEqual(1);
      expect(res.body.perPage).toEqual(DEFAULT_LIMIT_PAGINATION);
    });

    it('paginate', async () => {
      const qs: SimplePaginationDto = basicPagination();
      qs.perPage = TESTING_DEFAULT_PAGINATION;
      const { user } = await generateUserWith(service.getDataSource(), {
        permissions: permissions.filter((p) => {
          return p.name === PermissionNames.USER;
        }),
      });
      await generateRole(service.getDataSource());

      const res = await httpClient
        .get(addQueryString(baseRoute, qs as QueryString))
        .set('Authorization', generateAuthHeader(user, jwtService).authHeader);

      expect(res.status).toEqual(200);
      expect(Object.keys(res.body)).toEqual(PaginationKeys);
      expect(res.body.page).toEqual(1);
      expect(res.body.perPage).toEqual(TESTING_DEFAULT_PAGINATION);
    });
  });

  describe('findOne', function () {
    it('valid param', async () => {
      const { user } = await generateUserWith(service.getDataSource(), {
        permissions: permissions.filter((p) => {
          return p.name === PermissionNames.USER;
        }),
      });
      const { id } = await generateRole(service.getDataSource());

      const res = await httpClient
        .get(`${baseRoute}/${id}`)
        .set('Authorization', generateAuthHeader(user, jwtService).authHeader);

      expect(res.status).toEqual(200);
      expect(res.body.id).toEqual(id);
    });

    // FIXME test e2e roles
    // it('invalid param', async () => {
    //   const { user } = await generateUser(service.getDataSource());
    //   const res = await httpClient
    //     .get(`${baseRoute}/invalid`)
    //     .set('Authorization', generateAuthHeader(user, jwtService).authHeader);
    //
    //   expect(res.status).toEqual(500);
    //   expect(res.body.id).toBeUndefined();
    // });

    it('not found', async () => {
      const { user } = await generateUserWith(service.getDataSource(), {
        permissions: permissions.filter((p) => {
          return p.name === PermissionNames.USER;
        }),
      });
      const res = await httpClient
        .get(`${baseRoute}/-1`)
        .set('Authorization', generateAuthHeader(user, jwtService).authHeader);

      expect(res.status).toEqual(404);
      expect(res.body.id).toBeUndefined();
    });
  });

  describe('update', function () {
    it('only required data', async () => {
      const { id } = await generateRole(service.getDataSource());
      const data: UpdateRoleDto = {
        name: faker.animal.insect(),
        description: faker.datatype.uuid(),
      };
      const { user } = await generateUserWith(service.getDataSource(), {
        permissions: permissions.filter((p) => {
          return p.name === PermissionNames.USER;
        }),
      });
      const res = await httpClient
        .patch(`${baseRoute}/${id}`)
        .set('Authorization', generateAuthHeader(user, jwtService).authHeader)
        .send(data);

      expect(res.status).toEqual(200);

      expect(res.body.id).toEqual(id);
      expect(res.body.name).toEqual(data.name);
      expect(res.body.description).toEqual(data.description);
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
      const { user } = await generateUserWith(service.getDataSource(), {
        permissions: permissions.filter((p) => {
          return p.name === PermissionNames.USER;
        }),
      });
      const res = await httpClient
        .patch(`${baseRoute}/${id}`)
        .set('Authorization', generateAuthHeader(user, jwtService).authHeader)
        .send(data);

      expect(res.status).toEqual(200);
      expect(res.body.id).toEqual(id);
      expect(res.body.name).toEqual(data.name);
      expect(res.body.description).toEqual(data.description);
      expect(res.body.isActive).toEqual(data.isActive);
      expect(
        res.body.permissions.every((p) => {
          return data.permissions.includes(p.id);
        }),
      ).toEqual(true);
    });

    it('empty data, validate form', async () => {
      const role = await generateRole(service.getDataSource());
      const data = {} as UpdateRoleDto;
      const { user } = await generateUserWith(service.getDataSource(), {
        permissions: permissions.filter((p) => {
          return p.name === PermissionNames.USER;
        }),
      });
      const res = await httpClient
        .patch(`${baseRoute}/${role.id}`)
        .set('Authorization', generateAuthHeader(user, jwtService).authHeader)
        .send(data);
      const roleDb = await service
        .getDataSource()
        .getRepository(Role)
        .findOne({ where: { id: role.id } });

      expect(res.status).toEqual(200);
      expect(sortObjectStringify(role)).toEqual(sortObjectStringify(roleDb));
    });

    it('not found', async () => {
      const data: UpdateRoleDto = {
        name: faker.animal.insect(),
        description: faker.datatype.uuid(),
      };
      const { user } = await generateUserWith(service.getDataSource(), {
        permissions: permissions.filter((p) => {
          return p.name === PermissionNames.USER;
        }),
      });
      const res = await httpClient
        .patch(`${baseRoute}/${-1}`)
        .set('Authorization', generateAuthHeader(user, jwtService).authHeader)
        .send(data);

      expect(res.status).toEqual(404);
      expect(res.body.id).toBeUndefined();
    });
  });

  describe('delete', function () {
    it('valid param', async () => {
      const { user } = await generateUserWith(service.getDataSource(), {
        permissions: permissions.filter((p) => {
          return p.name === PermissionNames.USER;
        }),
      });
      const { id } = await generateRole(service.getDataSource());

      const res = await httpClient
        .delete(`${baseRoute}/${id}`)
        .set('Authorization', generateAuthHeader(user, jwtService).authHeader);
      const roleDel = await service
        .getDataSource()
        .getRepository(Role)
        .findOne({ where: { id } });

      expect(res.status).toEqual(200);
      expect(res.body.id).toBeUndefined();
      expect(roleDel).toBeNull();
    });

    // FIXME test e2e roles
    // it('invalid param', async () => {
    //   const { user } = await generateUser(service.getDataSource());
    //   const res = await httpClient
    //     .delete(`${baseRoute}/invalid`)
    //     .set('Authorization', generateAuthHeader(user, jwtService).authHeader);
    //
    //   expect(res.status).toEqual(500);
    //   expect(res.body.id).toBeUndefined();
    // });

    it('not found', async () => {
      const { user } = await generateUserWith(service.getDataSource(), {
        permissions: permissions.filter((p) => {
          return p.name === PermissionNames.USER;
        }),
      });
      const res = await httpClient
        .delete(`${baseRoute}/${-1}`)
        .set('Authorization', generateAuthHeader(user, jwtService).authHeader);

      expect(res.status).toEqual(404);
      expect(res.body.id).toBeUndefined();
    });
  });
});
