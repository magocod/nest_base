import { Test, TestingModule } from '@nestjs/testing';
import { MailService } from './mail.service';
import { MailerModule, MailerService } from '@nestjs-modules/mailer';
import { mailerAsyncOptions, mailQueueConfig } from './mail.module';
import { faker } from '@faker-js/faker';
import { fakeEmail, fakeEmailException, fakeJobJson } from '../../test/moks';
import { EmailQueue, emailQueueName } from './mail.constants';
import { getQueueToken } from '@nestjs/bull';
import { Job } from 'bull';

describe('MailService', () => {
  let service: MailService;
  let mailerService: MailerService;
  let module: TestingModule;
  let queue: EmailQueue;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        MailerModule.forRootAsync(mailerAsyncOptions),
        ...mailQueueConfig,
      ],
      providers: [
        MailService,
        // {
        //   provide: MailerService,
        //   useValue: mailerServiceMock(),
        // },
      ],
    })
      // .overrideProvider(MailerService)
      // .useClass(mailerServiceMock)
      // .overrideProvider(getQueueToken(emailQueueName))
      // .useValue(queueMock())
      .compile();

    mailerService = module.get<MailerService>(MailerService);
    service = module.get<MailService>(MailService);
    queue = module.get(getQueueToken(emailQueueName));
  });

  afterEach(async () => {
    await module.close();
  });

  describe('example', function () {
    it('email sent', async () => {
      const spy = jest
        .spyOn(mailerService, 'sendMail')
        .mockImplementation((args) => {
          return Promise.resolve(fakeEmail(args));
        });
      const email = faker.internet.email();
      const v = await service.example(email);
      // console.log('result a', v);

      expect(mailerService.sendMail).toBeCalledTimes(1);
      expect(v.accepted.includes(email)).toEqual(true);
      spy.mockRestore();
    });

    it('email sent, mock method', async () => {
      const spy = jest
        .spyOn(mailerService, 'sendMail')
        .mockImplementation((args) => {
          return Promise.resolve(fakeEmail(args));
        });

      const email = faker.internet.email();
      const v = await service.example(email);
      // console.log('result b', v);

      expect(mailerService.sendMail).toBeCalledTimes(1);
      expect(v.accepted.includes(email)).toEqual(true);
      spy.mockRestore();
    });

    it('exception', async () => {
      const spy = jest
        .spyOn(mailerService, 'sendMail')
        .mockImplementation((args) => {
          return Promise.resolve(fakeEmailException(args));
        });
      try {
        await service.example(faker.internet.email());
      } catch (e) {
        // console.log(e);
        // console.log(e.message);
        // console.log(e.code);
        expect(mailerService.sendMail).toBeCalledTimes(1);
        expect(e.code).toEqual('ESOCKET');
        // expect(e instanceof Error).toEqual(true);
      } finally {
        spy.mockRestore();
      }
    });

    it('queue', async () => {
      const spy = jest.spyOn(queue, 'add').mockImplementation((name, data) => {
        // console.log(data)
        return Promise.resolve(
          fakeJobJson(name as string, data),
        ) as unknown as Promise<Job>;
      });
      const email = faker.internet.email();
      const v = await service.sendEmailQueue({
        log: false,
        options: { to: email },
      });
      // console.log('result c', v);

      expect(v.id).toBeDefined();
      expect(queue.add).toBeCalledTimes(1);
      spy.mockRestore();
    });
  });
});
