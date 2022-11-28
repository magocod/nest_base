import { Test, TestingModule } from '@nestjs/testing';
import { MessagesService } from './messages.service';
import { commonConfig, configBaseModules } from '../app.module';
import { AuthModule } from '../auth/auth.module';
import { MessagesModule } from './messages.module';

describe('MessagesService', () => {
  let service: MessagesService;
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [...configBaseModules(commonConfig), AuthModule, MessagesModule],
      // providers: [MessagesService],
    }).compile();

    service = module.get<MessagesService>(MessagesService);
  });

  afterEach(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
