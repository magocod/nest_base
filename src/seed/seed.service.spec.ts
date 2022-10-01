import { Test, TestingModule } from '@nestjs/testing';
import { In, Repository } from 'typeorm';
import { SeedService, defaultEmails } from './seed.service';

import { configBaseModules } from '../app.module';
import { User } from '../auth/entities';

describe('SeedService', () => {
  let service: SeedService;
  let module: TestingModule;
  let userRep: Repository<User>;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: configBaseModules(),
      providers: [SeedService],
    }).compile();

    service = module.get<SeedService>(SeedService);
    userRep = service.getDataSource().getRepository(User);

    await userRep.delete({ email: In(Object.values(defaultEmails)) });
  });

  afterEach(async () => {
    await userRep.delete({ email: In(Object.values(defaultEmails)) });
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
