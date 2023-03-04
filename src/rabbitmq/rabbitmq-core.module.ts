import {
  DynamicModule,
  Global,
  Logger,
  Module,
  OnApplicationShutdown,
} from '@nestjs/common';
import { RabbitmqModuleOptions } from './interfaces';
import {
  createRabbitmqConnectionProvider,
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
    return {
      module: RabbitmqCoreModule,
      providers: [connectionProvider, senderProvider],
      exports: [connectionProvider, senderProvider],
    };
  }
}
