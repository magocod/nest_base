import { Test, TestingModule } from '@nestjs/testing';
// import { MessagesService } from './messages.service';
import { configBaseModules, commonConfig } from '../app.module';
import { AuthModule } from '../auth/auth.module';
import { MessagesModule } from './messages.module';
import { GroupGateway } from './group.gateway';

describe('GroupGateway', () => {
  let gateway: GroupGateway;
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [...configBaseModules(commonConfig), AuthModule, MessagesModule],
      providers: [
        // MessagesGateway,
        // MessagesService
      ],
    }).compile();

    gateway = module.get<GroupGateway>(GroupGateway);
  });

  afterEach(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});