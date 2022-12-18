import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import supertest from 'supertest';
import * as request from 'supertest';
import { AppModule, globalPrefix, configApp } from './../../src/app.module';
import { AppService } from './../../src/app.service';

import {
  generateUser,
  generateAuthHeader,
  generatePermission,
  generateRole,
  upsertPermission,
} from '../fixtures';
import { SimplePaginationDto } from '../../src/common/dtos/pagination.dto';
import {
  DEFAULT_LIMIT_PAGINATION,
  PaginationKeys,
} from '../../src/common/utils';
import {
  basicPagination,
  TESTING_DEFAULT_PAGINATION,
  addQueryString,
  QueryString,
} from '../helpers';
import { PermissionNames } from '../../src/auth/interfaces';
import { Permission } from '../../src/auth/entities';
import { ApiRouteVersion } from '../../src/app.constants';
import { DataSource } from 'typeorm';

const baseRoute = `/${globalPrefix}/${ApiRouteVersion.v1}/permissions`;

describe('Permissions - /permissions (e2e)', () => {
  let app: INestApplication;
  let jwtService: JwtService;
  let httpClient: supertest.SuperTest<supertest.Test>;
  let permissions: Permission[] = [];
  let ds: DataSource;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    jwtService = moduleFixture.get<JwtService>(JwtService);
    ds = moduleFixture.get<DataSource>(DataSource);

    app = moduleFixture.createNestApplication();
    configApp(app);

    await app.init();
    httpClient = request(app.getHttpServer());

    permissions = await upsertPermission(ds);
  });

  afterAll(async () => {
    await app.close();
  });

  it('must be authenticated', async function () {
    const res = await httpClient.get(baseRoute);

    expect(res.status).toEqual(401);
    expect(res.body.message).toEqual('Unauthorized');
  });

  describe('findAll', function () {
    it('unfiltered', async () => {
      const role = await generateRole(ds, {
        permissions: permissions.filter((p) => {
          return p.name === PermissionNames.USER;
        }),
      });
      const { user } = await generateUser(ds, {
        roles: [role],
      });
      await generatePermission(ds);

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
      const role = await generateRole(ds, {
        permissions: permissions.filter((p) => {
          return p.name === PermissionNames.USER;
        }),
      });
      const { user } = await generateUser(ds, {
        roles: [role],
      });
      await generatePermission(ds);

      const res = await httpClient
        .get(addQueryString(baseRoute, qs as QueryString))
        .set('Authorization', generateAuthHeader(user, jwtService).authHeader);

      expect(res.status).toEqual(200);
      expect(Object.keys(res.body)).toEqual(PaginationKeys);
      expect(res.body.page).toEqual(1);
      expect(res.body.perPage).toEqual(TESTING_DEFAULT_PAGINATION);
    });
  });
});
