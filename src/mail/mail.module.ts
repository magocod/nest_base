import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailController } from './mail.controller';

import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BullModule } from '@nestjs/bull';
import { emailQueueName } from './mail.constants';
import { MailProcessor } from './mail.processor';
import { MailConsumer } from './mail.consumer';

// console.log(process.env.MAIL_HOST)

export const mailerAsyncOptions = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (config: ConfigService) => {
    // console.log(process.env.MAIL_HOST);
    // console.log('d', config.get('MAIL_HOST'));
    return {
      // transport: config.get("MAIL_TRANSPORT"),
      // or
      transport: {
        host: config.get('MAIL_HOST'),
        port: config.get('MAIL_PORT'),
        secure: false,
        auth: {
          user: config.get('MAIL_USER'),
          pass: config.get('MAIL_PASSWORD'),
        },
      },
      defaults: {
        from: config.get('MAIL_FROM'),
      },
      template: {
        dir: join(__dirname, 'templates'),
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    };
  },
};

export const mailQueueConfig = [
  BullModule.registerQueue({
    name: emailQueueName,
  }),
];

@Module({
  imports: [
    ConfigModule,
    // MailerModule.forRoot({
    //   // transport: 'smtps://user@example.com:topsecret@smtp.example.com',
    //   // or
    //   transport: {
    //     host: process.env.MAIL_HOST,
    //     port: +process.env.MAIL_PORT,
    //     secure: false,
    //     auth: {
    //       user: process.env.MAIL_USER,
    //       pass: process.env.MAIL_PASSWORD,
    //     },
    //   },
    //   defaults: {
    //     from: process.env.MAIL_FROM,
    //   },
    //   template: {
    //     dir: join(__dirname, 'templates'),
    //     adapter: new HandlebarsAdapter(), // or new PugAdapter() or new EjsAdapter()
    //     options: {
    //       strict: true,
    //     },
    //   },
    // }),
    MailerModule.forRootAsync(mailerAsyncOptions),
    ...mailQueueConfig,
  ],
  controllers: [MailController],
  providers: [MailService, MailProcessor, MailConsumer],
  exports: [MailService, BullModule],
})
export class MailModule {}
