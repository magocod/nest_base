import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { validate } from 'class-validator';

import supertest from 'supertest';
import * as request from 'supertest';
import { faker } from '@faker-js/faker';
import { AppModule, globalPrefix, configApp } from './../../src/app.module';
import { AppService } from './../../src/app.service';
import { CreateUserDto } from './../../src/auth/dto';

import { generateUser } from '../fixtures';
import { PASSWORD_PATTERN } from '../../src/auth';

const baseRoute = `/${globalPrefix}/auth`;
const routeRegister = `${baseRoute}/register`;

describe('Auth - /auth (e2e)', () => {
  let app: INestApplication;
  let service: AppService;
  let httpClient: supertest.SuperTest<supertest.Test>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    service = moduleFixture.get<AppService>(AppService);

    app = moduleFixture.createNestApplication();
    configApp(app);

    await app.init();
    httpClient = request(app.getHttpServer());
  });

  afterEach(async () => {
    await app.close();
  });

  describe('public user registry', function () {
    it('register user successfully', async () => {
      const reqData = {
        email: faker.internet.email(),
        password: faker.internet.password(10, false, PASSWORD_PATTERN),
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
      const { user } = await generateUser(service.getDataSource());
      const reqData = {
        email: user.email,
        password: user.password,
        fullName: user.fullName,
      };
      const res = await httpClient.post(routeRegister).send(reqData);

      expect(res.status).toEqual(400);
      expect(res.body.message).toEqual(
        `Key (email)=(${reqData.email.toLowerCase()}) already exists.`,
      );
    });
  });
});
