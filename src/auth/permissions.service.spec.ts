import { Test, TestingModule } from '@nestjs/testing';
import { PermissionsService } from './permissions.service';
import { SimplePaginationDto } from '../common/dtos/pagination.dto';
import { DEFAULT_LIMIT_PAGINATION, PaginationKeys } from '../common/utils';
import {
  basicPagination,
  TESTING_DEFAULT_PAGINATION,
} from '../../test/helpers';

import { AuthModule } from './auth.module';
import { configBaseModules, postgresConfig } from '../app.module';

import { generatePermission } from '../../test/fixtures';

describe('PermissionsService', () => {
  let service: PermissionsService;
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [...configBaseModules(postgresConfig), AuthModule],
      providers: [PermissionsService],
    }).compile();

    service = module.get<PermissionsService>(PermissionsService);
  });

  afterEach(async () => {
    await module.close();
  });

  describe('findAll', function () {
    it('unfiltered', async () => {
      await generatePermission(service.getDataSource());
      const qs: SimplePaginationDto = {};
      const pagination = await service.findAll(qs);

      expect(Object.keys(pagination)).toEqual(PaginationKeys);
      expect(pagination.page).toEqual(1);
      expect(pagination.perPage).toEqual(DEFAULT_LIMIT_PAGINATION);
    });

    it('paginate', async () => {
      await generatePermission(service.getDataSource());
      const qs = basicPagination();
      qs.perPage = TESTING_DEFAULT_PAGINATION;
      const pagination = await service.findAll(qs);

      expect(Object.keys(pagination)).toEqual(PaginationKeys);
      expect(pagination.page).toEqual(1);
      expect(pagination.perPage).toEqual(TESTING_DEFAULT_PAGINATION);
    });
  });
});
