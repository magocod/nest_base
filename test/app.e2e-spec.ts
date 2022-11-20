import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule, configApp, globalPrefix } from './../src/app.module';
import { ApiRouteVersion } from '../src/app.constants';
import supertest from 'supertest';

const baseRoute = `/${globalPrefix}/${ApiRouteVersion.v1}/`;

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let httpClient: supertest.SuperTest<supertest.Test>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    configApp(app);
    await app.init();

    httpClient = request(app.getHttpServer());
  });

  afterAll(async () => {
    await app.close();
  });

  it('/v1 (GET)', () => {
    return request(app.getHttpServer())
      .get(baseRoute)
      .expect(200)
      .expect('Hello World!');
  });

  it('/v1 (GET), http client', async () => {
    const response = await httpClient.get(baseRoute);

    expect(response.status).toEqual(HttpStatus.OK);
    expect(response.text).toEqual('Hello World!');
  });
});
