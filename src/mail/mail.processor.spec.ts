import { Test, TestingModule } from '@nestjs/testing';
import { MailProcessor } from './mail.processor';
import { Job } from 'bull';
import { faker } from '@faker-js/faker';
import { fakeEmail } from '../../test/moks';
import { MailerModule, MailerService } from '@nestjs-modules/mailer';
import { mailerAsyncOptions } from './mail.module';

describe('MailProcessor', () => {
  let processor: MailProcessor;
  let module: TestingModule;
  let mailerService: MailerService;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [MailerModule.forRootAsync(mailerAsyncOptions)],
      providers: [MailProcessor],
    }).compile();

    mailerService = module.get<MailerService>(MailerService);
    processor = module.get<MailProcessor>(MailProcessor);
  });

  afterAll(async () => {
    await module.close();
  });

  it('handleSendEmailBasic', async () => {
    const spy = jest
      .spyOn(mailerService, 'sendMail')
      .mockImplementation((args) => {
        return Promise.resolve(fakeEmail(args));
      });
    const email = faker.internet.email();
    const job = {
      data: { log: true, options: { to: email } },
    };
    const result = await processor.handleSendEmailBasic(job as Job);
    // console.log(result);

    expect(mailerService.sendMail).toBeCalledTimes(1);
    expect(result.accepted.includes(email)).toEqual(true);
    spy.mockRestore();
  });
});
