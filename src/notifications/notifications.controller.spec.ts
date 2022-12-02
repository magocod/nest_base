import { Test, TestingModule } from '@nestjs/testing';
import { NotificationsController } from './notifications.controller';
// import { NotificationsService } from './notifications.service';

import { NotificationsModule } from './notifications.module';
import { AuthModule } from '../auth/auth.module';
import { configBaseModules, postgresConfig } from '../app.module';

describe('NotificationsController', () => {
  let controller: NotificationsController;
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        ...configBaseModules(postgresConfig),
        AuthModule,
        NotificationsModule,
      ],
      // controllers: [NotificationsController],
      // providers: [NotificationsService],
    }).compile();

    controller = module.get<NotificationsController>(NotificationsController);
  });

  afterEach(async () => {
    await module.close();
  });

  it('send notification without saving to bd, fake wss', () => {
    expect(controller.sendFakeVolatileMessage()).toEqual(1);
  });
});
