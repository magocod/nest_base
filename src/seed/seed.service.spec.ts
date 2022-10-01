import { Test, TestingModule } from '@nestjs/testing';
import { SeedService } from './seed.service';

import { configBaseModules } from '../app.module';

describe('SeedService', () => {
  let service: SeedService;
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: configBaseModules(),
      providers: [SeedService],
    }).compile();

    service = module.get<SeedService>(SeedService);
  });

  afterEach(async () => {
    await module.close();
  });

  describe('seed', function () {
    it('populate db', async () => {
      const result = await service.seed();
      // console.log(result);

      expect(result.users).not.toEqual(0);
      expect(result.roles).not.toEqual(0);
      expect(result.permissions).not.toEqual(0);
    });
  });
});
