import { Test, TestingModule } from '@nestjs/testing';
import { MailService } from './mail.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { mailerAsyncOptions, mailQueueConfig } from './mail.module';

describe('MailService', () => {
  let service: MailService;
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        MailerModule.forRootAsync(mailerAsyncOptions),
        ...mailQueueConfig,
      ],
      providers: [MailService],
    }).compile();

    service = module.get<MailService>(MailService);
  });

  afterEach(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
