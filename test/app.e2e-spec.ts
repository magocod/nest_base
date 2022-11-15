import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule, configApp, globalPrefix } from './../src/app.module';
import { ApiRouteVersion } from '../src/app.constants';

const baseRoute = `/${globalPrefix}/${ApiRouteVersion.v1}/`;

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    configApp(app);
    await app.init();
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
});
