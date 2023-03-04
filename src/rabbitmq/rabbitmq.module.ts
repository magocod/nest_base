import { DynamicModule, Module } from '@nestjs/common';
import { RabbitmqService } from './rabbitmq.service';
import { RabbitmqController } from './rabbitmq.controller';
import { RabbitmqModuleOptions } from './interfaces';
import { RabbitmqCoreModule } from './rabbitmq-core.module';

@Module({
  controllers: [RabbitmqController],
  providers: [RabbitmqService],
  exports: [RabbitmqService],
})
export class RabbitmqModule {
  /**
   * Global configuration
   *
   * @example
   * RabbitmqModule.forRoot({
   *    RABBITMQ_HOST: process.env.RABBITMQ_HOST,
   *    RABBITMQ_PORT: +process.env.RABBITMQ_PORT,
   *    RABBITMQ_USERNAME: process.env.RABBITMQ_USERNAME,
   *    RABBITMQ_PASSWORD: process.env.RABBITMQ_PASSWORD,
   *    RABBITMQ_VHOST: process.env.RABBITMQ_VHOST,
   *    queues: [
   *      {
   *        queue: 'tasks',
   *        onMessage: (channel, logger) => {
   *          return async function (msg) {
   *            // crash server
   *            // throw new Error('example error');
   *           if (msg !== null) {
   *              console.log('task Received:', msg.content.toString());
   *              channel.ack(msg);
   *            } else {
   *              console.log('task Consumer cancelled by server');
   *            }
   *          };
   *        },
   *        // options: { ... }
   *      }
   *    ],
   *  }),
   */
  static forRoot(options: RabbitmqModuleOptions): DynamicModule {
    return {
      module: RabbitmqModule,
      imports: [RabbitmqCoreModule.forRoot(options)],
    };
  }

  // TODO forFeature
}
