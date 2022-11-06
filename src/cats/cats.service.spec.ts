import { Test, TestingModule } from '@nestjs/testing';
import { CatsService } from './cats.service';
import { configBaseModules, mongoConfig } from '../app.module';
import { CatsModule } from './cats.module';
import { faker } from '@faker-js/faker';
import { CreateCatDto } from './dto';
import * as mongoose from 'mongoose';
import { PaginationMongoDto } from '../common/dtos/pagination.dto';
import { DEFAULT_LIMIT_PAGINATION, PaginationMongoKeys } from '../common/utils';
import {
  basicPagination,
  TESTING_DEFAULT_PAGINATION,
} from '../../test/helpers';
import { generateCat } from '../../test/fixtures';

describe('CatsService', () => {
  let service: CatsService;
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [...configBaseModules(mongoConfig), CatsModule],
      // providers: [CatsService],
    }).compile();

    service = module.get<CatsService>(CatsService);
  });

  afterAll(async () => {
    await module.close();
  });

  describe('create', function () {
    it('only required data', async () => {
      const data: CreateCatDto = {
        name: faker.animal.cat(),
        age: faker.datatype.number({ min: 1, max: 1000 }),
        breed: faker.datatype.uuid(),
      };
      const cat = await service.create(data);

      expect(cat.id).toBeDefined();
      expect(cat.name).toEqual(data.name);
      expect(cat.age).toEqual(data.age);
      expect(cat.breed).toEqual(data.breed);
    });

    it('with optional data', async () => {
      const data: CreateCatDto = {
        name: faker.animal.cat(),
        age: faker.datatype.number({ min: 1, max: 1000 }),
        breed: faker.datatype.uuid(),
        isActive: faker.datatype.boolean(),
      };
      const cat = await service.create(data);

      expect(cat.id).toBeDefined();
      expect(cat.name).toEqual(data.name);
      expect(cat.age).toEqual(data.age);
      expect(cat.breed).toEqual(data.breed);
      expect(cat.isActive).toEqual(data.isActive);
    });

    it('invalid data', async () => {
      const data = {} as CreateCatDto;
      try {
        await service.create(data);
      } catch (e) {
        expect(e).toBeInstanceOf(mongoose.Error.ValidationError);
      }
    });
  });

  describe('findAll', function () {
    it('unfiltered', async () => {
      await generateCat(service.getModel());
      const qs: PaginationMongoDto = {};
      const pagination = await service.findAll(qs);

      expect(Object.keys(pagination)).toEqual(PaginationMongoKeys);
      expect(pagination.skip).toEqual(0);
      expect(pagination.limit).toEqual(DEFAULT_LIMIT_PAGINATION);
    });

    it('paginate', async () => {
      await generateCat(service.getModel());
      const qs = basicPagination();
      qs.limit = TESTING_DEFAULT_PAGINATION;
      qs.skip = 1;
      const pagination = await service.findAll(qs);

      expect(Object.keys(pagination)).toEqual(PaginationMongoKeys);
      expect(pagination.skip).toEqual(qs.skip);
      expect(pagination.limit).toEqual(TESTING_DEFAULT_PAGINATION);
    });

    it('invalid qs', async () => {
      await generateCat(service.getModel());
      const qs = basicPagination();
      qs.limit = 'test';
      qs.skip = null;
      try {
        await service.findAll(qs);
      } catch (e) {
        expect(e).toBeInstanceOf(mongoose.Error.CastError);
      }
    });
  });
});
