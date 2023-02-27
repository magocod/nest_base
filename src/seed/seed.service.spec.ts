import { Test, TestingModule } from '@nestjs/testing';
import { In, Repository } from 'typeorm';
import { SeedService } from './seed.service';

import { configBaseModules, postgresConfig } from '../app.module';
import { User } from '../auth/entities';
import { DefaultEmails } from '../auth/interfaces';
import { AuthModule } from '../auth/auth.module';
import { NotificationsModule } from '../notifications/notifications.module';

describe('SeedService', () => {
  let service: SeedService;
  let module: TestingModule;
  let userRep: Repository<User>;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        ...configBaseModules(postgresConfig),
        AuthModule,
        NotificationsModule,
      ],
      providers: [SeedService],
    }).compile();

    service = module.get<SeedService>(SeedService);
    userRep = service.getDataSource().getRepository(User);

    await userRep.delete({ email: In(Object.values(DefaultEmails)) });
  });

  afterEach(async () => {
    await userRep.delete({ email: In(Object.values(DefaultEmails)) });
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
