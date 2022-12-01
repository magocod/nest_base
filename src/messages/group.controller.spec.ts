import { Test, TestingModule } from '@nestjs/testing';
import { GroupController } from './group.controller';
import { commonConfig, configBaseModules } from '../app.module';
import { MessagesModule } from './messages.module';
import { AuthModule } from '../auth/auth.module';

describe('GroupController', () => {
  let controller: GroupController;
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [...configBaseModules(commonConfig), AuthModule, MessagesModule],
    }).compile();

    controller = module.get<GroupController>(GroupController);
  });

  afterEach(async () => {
    await module.close();
  });

  it('should be defined', async () => {
    expect(controller).toBeDefined();
  });
});
