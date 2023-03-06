import {
  DynamicModule,
  Global,
  Logger,
  Module,
  OnApplicationShutdown,
  // OnModuleInit,
} from '@nestjs/common';
import { RabbitmqModuleOptions } from './interfaces';
import {
  createRabbitmqConnectionProvider,
  createRabbitmqConsumerProvider,
  createRabbitmqSenderProvider,
} from './rabbitmq.provider';
import { ModuleRef } from '@nestjs/core';
import { RABBITMQ_CONNECTION } from './rabbitmq.constants';
import { Connection } from 'amqplib';

@Global()
@Module({})
export class RabbitmqCoreModule implements OnApplicationShutdown {
  private readonly logger = new Logger('RabbitmqCoreModule');
  constructor(private readonly moduleRef: ModuleRef) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async onApplicationShutdown(signal?: string) {
    const conn = this.moduleRef.get<Connection>(RABBITMQ_CONNECTION);
    try {
      await conn.close();
    } catch (e) {
      this.logger.error(e?.message);
    }
  }
  static forRoot(options: RabbitmqModuleOptions): DynamicModule {
    const connectionProvider = createRabbitmqConnectionProvider(options);
    const senderProvider = createRabbitmqSenderProvider();
    const consumerProviders = createRabbitmqConsumerProvider(
      RabbitmqCoreModule.name,
      options.consumers,
    );
    return {
      module: RabbitmqCoreModule,
      providers: [connectionProvider, senderProvider, consumerProviders],
      exports: [connectionProvider, senderProvider, consumerProviders],
    };
  }
}
