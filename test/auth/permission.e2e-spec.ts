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

const baseRoute = `/${globalPrefix}/permissions`;

describe('Permissions - /permissions (e2e)', () => {
  let app: INestApplication;
  let service: AppService;
  let jwtService: JwtService;
  let httpClient: supertest.SuperTest<supertest.Test>;

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
  });

  afterAll(async () => {
    await app.close();
  });

  describe('findAll', function () {
    it('unfiltered', async () => {
      const { user } = await generateUser(service.getDataSource());
      await generatePermission(service.getDataSource());

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
      const { user } = await generateUser(service.getDataSource());
      await generatePermission(service.getDataSource());

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
