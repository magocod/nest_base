import { Test, TestingModule } from '@nestjs/testing';
import { faker } from '@faker-js/faker';
import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';

import { CreateUserDto } from './dto/create-user.dto';
import { AuthService } from './auth.service';
import { AuthModule } from './auth.module';
import { configBaseModules } from '../app.module';

import { generateUser } from '../../test/fixtures';

describe('AuthService', () => {
  let service: AuthService;
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [...configBaseModules(), AuthModule],
      providers: [AuthService],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  afterEach(async () => {
    await module.close();
  });

  it('create user successfully', async () => {
    const data = {
      email: faker.internet.email(),
      password: faker.internet.password(),
      fullName: faker.name.fullName(),
    };
    const payload = await service.create(data);

    expect(Object.keys(payload).sort()).toEqual(
      expect.arrayContaining(['token']),
    );
    expect(payload.email).toEqual(data.email.toLowerCase());
    expect(payload.password).toBeUndefined();
    expect(payload.fullName).toEqual(data.fullName);
  });

  it('duplicate mail error', async () => {
    const { user } = await generateUser(service.getDataSource());
    const data = {
      email: user.email,
      password: user.password,
      fullName: user.fullName,
    };

    try {
      await service.create(data);
    } catch (e) {
      expect(e).toBeInstanceOf(BadRequestException);
    }
  });

  it('invalid data error', async () => {
    const data = {} as CreateUserDto;

    try {
      await service.create(data);
    } catch (e) {
      expect(e).toBeInstanceOf(InternalServerErrorException);
    }
  });
});
