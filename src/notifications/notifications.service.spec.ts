import { Test, TestingModule } from '@nestjs/testing';
import { NotificationsService } from './notifications.service';

import { NotificationsModule } from './notifications.module';
import { configBaseModules, postgresConfig } from '../app.module';

describe('NotificationsService', () => {
  let service: NotificationsService;
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [...configBaseModules(postgresConfig), NotificationsModule],
      // providers: [NotificationsService],
    }).compile();

    service = module.get<NotificationsService>(NotificationsService);
  });

  afterEach(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
