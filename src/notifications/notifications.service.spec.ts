import { Test, TestingModule } from '@nestjs/testing';
import { NotificationsService } from './notifications.service';

import { NotificationsModule } from './notifications.module';
import { configBaseModules, postgresConfig } from '../app.module';

describe('NotificationsService', () => {
  let service: NotificationsService;
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        ...configBaseModules({ ...postgresConfig, websocket: true }),
        NotificationsModule,
      ],
      // providers: [NotificationsService],
    }).compile();

    service = module.get<NotificationsService>(NotificationsService);
  });

  afterEach(async () => {
    await module.close();
  });

  it('find all with, sql raw query', async () => {
    const rs = await service.findAll();

    // console.log(JSON.stringify(rs, null, 2));

    expect(rs.queryRaw).toBeInstanceOf(Array);
    expect(rs.queryRaw.length).toEqual(3);

    expect(Array.isArray(rs.managerQueryRaw)).toEqual(true);
    expect(rs.managerQueryRaw.length).toEqual(4);
  });
});
