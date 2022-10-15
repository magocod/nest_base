import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
// import { validate } from 'class-validator';

import supertest from 'supertest';
import * as request from 'supertest';
// import { faker } from '@faker-js/faker';
import { AppModule, globalPrefix, configApp } from './../../src/app.module';
import { AppService } from './../../src/app.service';

import {
  generateAuthHeader,
  upsertPermission,
  generateUserWith,
  generatePassword,
  generateRole,
  generateUser,
} from '../fixtures';
import { Permission } from '../../src/auth/entities';
import { SimplePaginationDto } from '../../src/common/dtos/pagination.dto';
import {
  basicPagination,
  // sortObjectStringify,
  TESTING_DEFAULT_PAGINATION,
  addQueryString,
  QueryString,
} from '../helpers';
import { PermissionNames } from '../../src/auth/interfaces';
import { AdminCreateUserDto, AdminUpdateUserDto } from '../../src/auth/dto';
import { faker } from '@faker-js/faker';
import { validate } from 'class-validator';
import {
  DEFAULT_LIMIT_PAGINATION,
  PaginationKeys,
} from '../../src/common/utils';

const baseRoute = `/${globalPrefix}/users`;

describe('Users - /users (e2e)', () => {
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
      const data: AdminCreateUserDto = {
        email: faker.internet.email(),
        fullName: faker.name.fullName(),
        password: generatePassword(),
      };
      const res = await httpClient
        .post(baseRoute)
        .set('Authorization', generateAuthHeader(user, jwtService).authHeader)
        .send(data);

      expect(res.status).toEqual(201);
      expect(res.body.id).toBeDefined();
      expect(res.body.email).toEqual(data.email.toLowerCase());
      expect(res.body.fullName).toEqual(data.fullName);
      expect(res.body.password).toBeUndefined();
    });

    it('with optional data', async () => {
      const { user } = await generateUserWith(service.getDataSource(), {
        permissions: permissions.filter((p) => {
          return p.name === PermissionNames.USER;
        }),
      });
      const role = await generateRole(service.getDataSource());
      const data: AdminCreateUserDto = {
        email: faker.internet.email(),
        fullName: faker.name.fullName(),
        password: generatePassword(),
        isActive: faker.datatype.boolean(),
        roles: [role.id],
      };
      const res = await httpClient
        .post(baseRoute)
        .set('Authorization', generateAuthHeader(user, jwtService).authHeader)
        .send(data);

      expect(res.status).toEqual(201);
      expect(res.body.id).toBeDefined();
      expect(res.body.email).toEqual(data.email.toLowerCase());
      expect(res.body.fullName).toEqual(data.fullName);
      expect(res.body.password).toBeUndefined();
      expect(res.body.isActive).toEqual(data.isActive);
      expect(
        res.body.roles.every((p) => {
          return data.roles.includes(p.id);
        }),
      ).toEqual(true);
    });

    it('invalid data', async () => {
      const { user } = await generateUserWith(service.getDataSource(), {
        permissions: permissions.filter((p) => {
          return p.name === PermissionNames.USER;
        }),
      });
      const validation = await validate(new AdminCreateUserDto());

      const res = await httpClient
        .post(baseRoute)
        .set('Authorization', generateAuthHeader(user, jwtService).authHeader)
        .send({});

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
      // ...

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
      // ...

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
      const other = await generateUser(service.getDataSource(), {});

      const res = await httpClient
        .get(`${baseRoute}/${other.user.id}`)
        .set('Authorization', generateAuthHeader(user, jwtService).authHeader);

      expect(res.status).toEqual(200);
      expect(res.body.id).toEqual(other.user.id);
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
      const other = await generateUser(service.getDataSource());
      const data: AdminUpdateUserDto = {
        email: faker.internet.email(),
        fullName: faker.name.fullName(),
      };
      const { user } = await generateUserWith(service.getDataSource(), {
        permissions: permissions.filter((p) => {
          return p.name === PermissionNames.USER;
        }),
      });
      const res = await httpClient
        .patch(`${baseRoute}/${other.user.id}`)
        .set('Authorization', generateAuthHeader(user, jwtService).authHeader)
        .send(data);

      expect(res.status).toEqual(200);
      expect(res.body.id).toEqual(other.user.id);
      expect(res.body.email).toEqual(data.email.toLowerCase());
      expect(res.body.fullName).toEqual(data.fullName);
      expect(res.body.password).toBeUndefined();
    });

    it('with optional data', async () => {
      const other = await generateUser(service.getDataSource());
      const role = await generateRole(service.getDataSource());
      const data: AdminUpdateUserDto = {
        email: faker.internet.email(),
        fullName: faker.name.fullName(),
        password: generatePassword(),
        isActive: faker.datatype.boolean(),
        roles: [role.id],
      };
      const { user } = await generateUserWith(service.getDataSource(), {
        permissions: permissions.filter((p) => {
          return p.name === PermissionNames.USER;
        }),
      });
      const res = await httpClient
        .patch(`${baseRoute}/${other.user.id}`)
        .set('Authorization', generateAuthHeader(user, jwtService).authHeader)
        .send(data);

      expect(res.status).toEqual(200);
      expect(res.body.id).toEqual(other.user.id);
      expect(res.body.email).toEqual(data.email.toLowerCase());
      expect(res.body.fullName).toEqual(data.fullName);
      expect(res.body.password).toBeUndefined();
      expect(res.body.isActive).toEqual(data.isActive);
      expect(
        res.body.roles.every((p) => {
          return data.roles.includes(p.id);
        }),
      ).toEqual(true);
    });

    it('empty data, validate form', async () => {
      const other = await generateUser(service.getDataSource());
      delete other.user.password;
      const data: AdminUpdateUserDto = {};
      const { user } = await generateUserWith(service.getDataSource(), {
        permissions: permissions.filter((p) => {
          return p.name === PermissionNames.USER;
        }),
      });
      const res = await httpClient
        .patch(`${baseRoute}/${other.user.id}`)
        .set('Authorization', generateAuthHeader(user, jwtService).authHeader)
        .send(data);
      // const userDb = await service
      //   .getDataSource()
      //   .getRepository(User)
      //   .findOne({ where: { id: other.user.id } });

      expect(res.status).toEqual(200);
      // expect(sortObjectStringify(other.user)).toEqual(
      //   sortObjectStringify(userDb),
      // );
    });

    it('not found', async () => {
      const { user } = await generateUserWith(service.getDataSource(), {
        permissions: permissions.filter((p) => {
          return p.name === PermissionNames.USER;
        }),
      });
      const res = await httpClient
        .patch(`${baseRoute}/${-1}`)
        .set('Authorization', generateAuthHeader(user, jwtService).authHeader);

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
      const other = await generateUser(service.getDataSource(), {});

      const res = await httpClient
        .delete(`${baseRoute}/${other.user.id}`)
        .set('Authorization', generateAuthHeader(user, jwtService).authHeader);

      expect(res.status).toEqual(200);
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
