import { DynamicModule, Module } from '@nestjs/common';
import { RabbitmqService } from './rabbitmq.service';
import { RabbitmqController } from './rabbitmq.controller';
import { RabbitmqModuleOptions } from './interfaces';
import {
  createRabbitmqConnectionProvider,
  createRabbitmqSenderProvider,
} from './rabbitmq.provider';

@Module({
  controllers: [RabbitmqController],
  providers: [RabbitmqService],
})
export class RabbitmqModule {
  static forRoot(options: RabbitmqModuleOptions): DynamicModule {
    const connectionProvider = createRabbitmqConnectionProvider(options);
    const senderProvider = createRabbitmqSenderProvider();
    return {
      module: RabbitmqModule,
      providers: [connectionProvider, senderProvider],
      exports: [connectionProvider, senderProvider],
    };
  }

  // TODO forFeature
}
