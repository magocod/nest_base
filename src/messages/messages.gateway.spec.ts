import { Test, TestingModule } from '@nestjs/testing';
import { MessagesGateway } from './messages.gateway';
// import { MessagesService } from './messages.service';
import { configBaseModules, commonConfig } from '../app.module';
import { AuthModule } from '../auth/auth.module';
import { MessagesModule } from './messages.module';

describe('MessagesGateway', () => {
  let gateway: MessagesGateway;
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        ...configBaseModules({
          ...commonConfig,
          websocket: false,
          mysql: false,
        }),
        AuthModule,
        MessagesModule,
      ],
      providers: [
        // MessagesGateway,
        // MessagesService
      ],
    }).compile();

    gateway = module.get<MessagesGateway>(MessagesGateway);
  });

  afterEach(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
