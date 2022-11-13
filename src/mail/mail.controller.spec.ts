import { Test, TestingModule } from '@nestjs/testing';
import { MailController } from './mail.controller';
import { MailService } from './mail.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { mailerAsyncOptions, mailQueueConfig } from './mail.module';

describe('MailController', () => {
  let controller: MailController;
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        MailerModule.forRootAsync(mailerAsyncOptions),
        ...mailQueueConfig,
      ],
      controllers: [MailController],
      providers: [MailService],
    }).compile();

    controller = module.get<MailController>(MailController);
  });
  1;
  afterEach(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
