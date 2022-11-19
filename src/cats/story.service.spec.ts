import { Test, TestingModule } from '@nestjs/testing';
import { StoryService } from './story.service';
import { configBaseModules, mongoConfig } from '../app.module';
import { CatsModule } from './cats.module';
import { PaginationMongoDto } from '../common/dtos';
import { DEFAULT_LIMIT_PAGINATION, PaginationMongoKeys } from '../common/utils';
import {
  basicPagination,
  TESTING_DEFAULT_PAGINATION,
} from '../../test/helpers';
import mongoose from 'mongoose';
import { generateCatWith, generateOwner } from '../../test/fixtures';

describe('StoryService', () => {
  let service: StoryService;
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [...configBaseModules(mongoConfig), CatsModule],
      // providers: [CatsService],
    }).compile();

    service = module.get<StoryService>(StoryService);
  });

  afterAll(async () => {
    await module.close();
  });

  describe('findAll', function () {
    it('unfiltered', async () => {
      await generateOwner(service.getConnection());
      const qs: PaginationMongoDto = {};
      const pagination = await service.findAll(qs);

      expect(Object.keys(pagination)).toEqual(PaginationMongoKeys);
      expect(pagination.skip).toEqual(0);
      expect(pagination.limit).toEqual(DEFAULT_LIMIT_PAGINATION);
    });

    it('eager loading', async () => {
      await generateCatWith(service.getConnection(), {
        stories: 2,
        owner: false,
      });

      const qs: PaginationMongoDto = {};
      const pagination = await service.findAll(qs);

      // console.log(JSON.stringify(pagination.data, null, 2));

      expect(Object.keys(pagination)).toEqual(PaginationMongoKeys);
      expect(pagination.skip).toEqual(0);
      expect(pagination.limit).toEqual(DEFAULT_LIMIT_PAGINATION);
    });

    it('paginate', async () => {
      await generateOwner(service.getConnection());
      const qs = basicPagination();
      qs.limit = TESTING_DEFAULT_PAGINATION;
      qs.skip = 1;
      const pagination = await service.findAll(qs);

      expect(Object.keys(pagination)).toEqual(PaginationMongoKeys);
      expect(pagination.skip).toEqual(qs.skip);
      expect(pagination.limit).toEqual(TESTING_DEFAULT_PAGINATION);
    });

    it('invalid qs', async () => {
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
