import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { validate } from 'class-validator';

import supertest from 'supertest';
import * as request from 'supertest';
import { faker } from '@faker-js/faker';
import { AppModule, globalPrefix, configApp } from './../../src/app.module';
import { AppService } from './../../src/app.service';
import { CreateUserDto, LoginUserDto } from './../../src/auth/dto';
import {
  CREDENTIALS_INVALID_EMAIL,
  CREDENTIALS_INVALID_PASSWORD,
} from '../../src/auth/messages';

import {
  generateUser,
  generatePassword,
  generateAuthHeader,
  generateRole,
  upsertPermission,
} from '../fixtures';
import { Permission } from '../../src/auth/entities';
import { PermissionNames } from '../../src/auth/interfaces';

const baseRoute = `/${globalPrefix}/auth`;
const routeRegister = `${baseRoute}/register`;
const routeLogin = `${baseRoute}/login`;
const routeCheckStatus = `${baseRoute}/check-status`;
const routePrivate = `${baseRoute}/private`;
const routePrivate2 = `${baseRoute}/private2`;
const routePrivate3 = `${baseRoute}/private3`;

describe('Auth - /auth (e2e)', () => {
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

  describe('public user registry', function () {
    it('register user successfully', async () => {
      const reqData = {
        email: faker.internet.email(),
        password: generatePassword(),
        fullName: faker.name.fullName(),
      };
      const res = await httpClient.post(routeRegister).send(reqData);

      expect(res.status).toEqual(201);
      expect(res.body.email).toEqual(reqData.email.toLowerCase());
      expect(res.body.password).toBeUndefined();
      expect(res.body.fullName).toEqual(reqData.fullName);
    });

    it('validate user creation form', async () => {
      const res = await httpClient.post(routeRegister).send({});

      const validation = await validate(new CreateUserDto());

      expect(res.status).toEqual(400);
      expect(res.body.message).toEqual(
        validation.flatMap((v) => {
          return Object.values(v.constraints);
        }),
      );
    });

    it('duplicate user email', async () => {
      const { user, password } = await generateUser(service.getDataSource());
      const reqData = {
        email: user.email,
        password,
        fullName: user.fullName,
      };
      const res = await httpClient.post(routeRegister).send(reqData);

      expect(res.status).toEqual(400);
      expect(res.body.message).toEqual(
        `Key (email)=(${reqData.email.toLowerCase()}) already exists.`,
      );
    });
  });

  describe('login', function () {
    it('valid credentials', async () => {
      const { user, password } = await generateUser(service.getDataSource());
      const reqData = {
        email: user.email,
        password,
      };
      const res = await httpClient.post(routeLogin).send(reqData);

      expect(res.status).toEqual(201);
      expect(res.body.id).toEqual(user.id);
      expect(res.body.token).toBeDefined();
    });

    it('validate login form', async () => {
      const res = await httpClient.post(routeLogin).send({});

      const validation = await validate(new LoginUserDto());

      expect(res.status).toEqual(400);
      expect(res.body.message).toEqual(
        validation.flatMap((v) => {
          return Object.values(v.constraints);
        }),
      );
    });

    it('invalid credentials - password', async () => {
      const { user } = await generateUser(service.getDataSource());
      const reqData = {
        email: user.email,
        password: generatePassword(),
      };
      const res = await httpClient.post(routeLogin).send(reqData);

      expect(res.status).toEqual(401);
      expect(res.body.message).toEqual(CREDENTIALS_INVALID_PASSWORD);
    });

    it('invalid credentials - email', async () => {
      const reqData = {
        email: 'invalidemail@domain.com',
        password: generatePassword(),
      };
      const res = await httpClient.post(routeLogin).send(reqData);

      expect(res.status).toEqual(401);
      expect(res.body.message).toEqual(CREDENTIALS_INVALID_EMAIL);
    });
  });

  describe('authenticated user', function () {
    it('valid token', async () => {
      const { user } = await generateUser(service.getDataSource());
      const res = await httpClient
        .get(routeCheckStatus)
        .set('Authorization', generateAuthHeader(user, jwtService).authHeader);

      expect(res.status).toEqual(200);
      expect(res.body.id).toEqual(user.id);
      expect(res.body.token).toBeDefined();
    });

    it('without providing token', async () => {
      const res = await httpClient.get(routeCheckStatus);

      expect(res.status).toEqual(401);
      expect(res.body.message).toEqual('Unauthorized');
    });
  });

  describe('authorize user', function () {
    it('no permissions required', async () => {
      const { user } = await generateUser(service.getDataSource());
      const res = await httpClient
        .get(routePrivate)
        .set('Authorization', generateAuthHeader(user, jwtService).authHeader);

      expect(res.status).toEqual(200);
      expect(res.body.user.id).toEqual(user.id);
    });

    it('requires at least one permissions', async () => {
      const role = await generateRole(service.getDataSource(), {
        permissions,
      });
      const { user } = await generateUser(service.getDataSource(), {
        roles: [role],
      });
      const res = await httpClient
        .get(routePrivate2)
        .set('Authorization', generateAuthHeader(user, jwtService).authHeader);

      expect(res.status).toEqual(200);
      expect(res.body.user.id).toEqual(user.id);
    });

    it('have the required permission', async () => {
      const role = await generateRole(service.getDataSource(), {
        permissions: permissions.filter((p) => {
          return p.name === PermissionNames.EXAMPLE;
        }),
      });
      const { user } = await generateUser(service.getDataSource(), {
        roles: [role],
      });
      const res = await httpClient
        .get(routePrivate3)
        .set('Authorization', generateAuthHeader(user, jwtService).authHeader);

      expect(res.status).toEqual(200);
      expect(res.body.user.id).toEqual(user.id);
    });

    it('do not have the required permission', async () => {
      const role = await generateRole(service.getDataSource(), {
        permissions: permissions.filter((p) => {
          return p.name === PermissionNames.USER;
        }),
      });
      const { user } = await generateUser(service.getDataSource(), {
        roles: [role],
      });
      const res = await httpClient
        .get(routePrivate3)
        .set('Authorization', generateAuthHeader(user, jwtService).authHeader);

      expect(res.status).toEqual(403);
    });

    it('no assigned role', async () => {
      const { user } = await generateUser(service.getDataSource());
      const res = await httpClient
        .get(routePrivate3)
        .set('Authorization', generateAuthHeader(user, jwtService).authHeader);

      expect(res.status).toEqual(403);
    });
  });
});
