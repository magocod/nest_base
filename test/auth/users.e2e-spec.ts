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
} from '../fixtures';
import { Permission } from '../../src/auth/entities';
import { SimplePaginationDto } from '../../src/common/dtos/pagination.dto';
// import {
//   DEFAULT_LIMIT_PAGINATION,
//   PaginationKeys,
// } from '../../src/common/utils';
import {
  basicPagination,
  // sortObjectStringify,
  TESTING_DEFAULT_PAGINATION,
  addQueryString,
  QueryString,
} from '../helpers';
import { PermissionNames } from '../../src/auth/interfaces';

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
      // ...
      const res = await httpClient
        .post(baseRoute)
        .set('Authorization', generateAuthHeader(user, jwtService).authHeader);

      expect(res.status).toEqual(201);
    });

    it('with optional data', async () => {
      const { user } = await generateUserWith(service.getDataSource(), {
        permissions: permissions.filter((p) => {
          return p.name === PermissionNames.USER;
        }),
      });
      // ...
      const res = await httpClient
        .post(baseRoute)
        .set('Authorization', generateAuthHeader(user, jwtService).authHeader);

      expect(res.status).toEqual(201);
    });

    // it('invalid data', async () => {
    //   const { user } = await generateUserWith(service.getDataSource(), {
    //     permissions: permissions.filter((p) => {
    //       return p.name === PermissionNames.USER;
    //     }),
    //   });
    //   // ...
    //
    //   const res = await httpClient
    //     .post(baseRoute)
    //     .set('Authorization', generateAuthHeader(user, jwtService).authHeader);
    //
    //   expect(res.status).toEqual(400);
    // });
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
    });
  });

  describe('findOne', function () {
    it('valid param', async () => {
      const { user } = await generateUserWith(service.getDataSource(), {
        permissions: permissions.filter((p) => {
          return p.name === PermissionNames.USER;
        }),
      });
      const id = 1;

      const res = await httpClient
        .get(`${baseRoute}/${id}`)
        .set('Authorization', generateAuthHeader(user, jwtService).authHeader);

      expect(res.status).toEqual(200);
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

    // it('not found', async () => {
    //   const { user } = await generateUserWith(service.getDataSource(), {
    //     permissions: permissions.filter((p) => {
    //       return p.name === PermissionNames.USER;
    //     }),
    //   });
    //   const res = await httpClient
    //     .get(`${baseRoute}/-1`)
    //     .set('Authorization', generateAuthHeader(user, jwtService).authHeader);
    //
    //   expect(res.status).toEqual(404);
    //   expect(res.body.id).toBeUndefined();
    // });
  });

  describe('update', function () {
    it('only required data', async () => {
      const id = 1;
      // ...
      const { user } = await generateUserWith(service.getDataSource(), {
        permissions: permissions.filter((p) => {
          return p.name === PermissionNames.USER;
        }),
      });
      const res = await httpClient
        .patch(`${baseRoute}/${id}`)
        .set('Authorization', generateAuthHeader(user, jwtService).authHeader);

      expect(res.status).toEqual(200);
    });

    it('with optional data', async () => {
      const id = 1;
      // ...
      const { user } = await generateUserWith(service.getDataSource(), {
        permissions: permissions.filter((p) => {
          return p.name === PermissionNames.USER;
        }),
      });
      const res = await httpClient
        .patch(`${baseRoute}/${id}`)
        .set('Authorization', generateAuthHeader(user, jwtService).authHeader);

      expect(res.status).toEqual(200);
    });

    it('empty data, validate form', async () => {
      const id = 1;
      // ...
      const { user } = await generateUserWith(service.getDataSource(), {
        permissions: permissions.filter((p) => {
          return p.name === PermissionNames.USER;
        }),
      });
      const res = await httpClient
        .patch(`${baseRoute}/${id}`)
        .set('Authorization', generateAuthHeader(user, jwtService).authHeader);

      expect(res.status).toEqual(200);
    });

    // it('not found', async () => {
    //   const { user } = await generateUserWith(service.getDataSource(), {
    //     permissions: permissions.filter((p) => {
    //       return p.name === PermissionNames.USER;
    //     }),
    //   });
    //   const res = await httpClient
    //     .patch(`${baseRoute}/${-1}`)
    //     .set('Authorization', generateAuthHeader(user, jwtService).authHeader)
    //
    //   expect(res.status).toEqual(404);
    //   expect(res.body.id).toBeUndefined();
    // });
  });

  describe('delete', function () {
    it('valid param', async () => {
      const { user } = await generateUserWith(service.getDataSource(), {
        permissions: permissions.filter((p) => {
          return p.name === PermissionNames.USER;
        }),
      });
      const id = 1;

      const res = await httpClient
        .delete(`${baseRoute}/${id}`)
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

    // it('not found', async () => {
    //   const { user } = await generateUserWith(service.getDataSource(), {
    //     permissions: permissions.filter((p) => {
    //       return p.name === PermissionNames.USER;
    //     }),
    //   });
    //   const res = await httpClient
    //     .delete(`${baseRoute}/${-1}`)
    //     .set('Authorization', generateAuthHeader(user, jwtService).authHeader);
    //
    //   expect(res.status).toEqual(404);
    //   expect(res.body.id).toBeUndefined();
    // });
  });
});
