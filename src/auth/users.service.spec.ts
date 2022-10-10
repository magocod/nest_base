import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';

import { AuthModule } from './auth.module';
import { configBaseModules } from '../app.module';

describe('UsersService', () => {
  // let service: UsersService;
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [...configBaseModules(), AuthModule],
      providers: [UsersService],
    }).compile();

    // service = module.get<UsersService>(UsersService);
  });

  afterEach(async () => {
    await module.close();
  });

  describe('create', function () {
    it('only required data', async () => {
      // ...
      expect(1).toEqual(1);
    });

    it('with optional data', async () => {
      // ...
      expect(1).toEqual(1);
    });

    it('invalid data', async () => {
      // ...
      expect(1).toEqual(1);
    });
  });

  describe('findAll', function () {
    it('unfiltered', async () => {
      // ...
      expect(1).toEqual(1);
    });

    it('paginate', async () => {
      // ...
      expect(1).toEqual(1);
    });
  });

  describe('findOne', function () {
    it('valid param', async () => {
      // ...
      expect(1).toEqual(1);
    });

    it('invalid param', async () => {
      // ...
      expect(1).toEqual(1);
    });

    it('not found', async () => {
      // ...
      expect(1).toEqual(1);
    });
  });

  describe('update', function () {
    it('only required data', async () => {
      // ...
      expect(1).toEqual(1);
    });

    it('with optional data', async () => {
      // ...
      expect(1).toEqual(1);
    });

    it('empty data', async () => {
      // ...
      expect(1).toEqual(1);
    });

    it('not found', async () => {
      // ...
      expect(1).toEqual(1);
    });
  });

  describe('delete', function () {
    it('valid param', async () => {
      // ...
      expect(1).toEqual(1);
    });

    it('invalid param', async () => {
      // ...
      expect(1).toEqual(1);
    });

    it('not found', async () => {
      // ...
      expect(1).toEqual(1);
    });
  });
});
