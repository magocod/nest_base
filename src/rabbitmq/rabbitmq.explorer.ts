import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { DiscoveryService, ModuleRef } from '@nestjs/core';
import { InstanceWrapper } from '@nestjs/core/injector/instance-wrapper';
import { RABBITMQ_CONNECTION, RABBITMQ_CONSUMER } from './rabbitmq.constants';
import { ChannelConsumerProvider } from './interfaces';
import { Connection } from 'amqplib';

@Injectable()
export class RabbitmqExplorer implements OnModuleInit {
  private readonly logger = new Logger('RabbitmqExplorer');
  constructor(
    private readonly moduleRef: ModuleRef,
    private readonly discoveryService: DiscoveryService,
    @Inject(RABBITMQ_CONNECTION) public conn: Connection,
  ) {}

  async onModuleInit() {
    await this.explore();
  }

  async explore() {
    this.logger.log('Starting consumers');
    const providers: InstanceWrapper<ChannelConsumerProvider[]>[] =
      this.discoveryService.getProviders().filter((provider) => {
        return provider.name.includes(RABBITMQ_CONSUMER);
      });
    for (const provider of providers) {
      // console.log('module', provider.name.split('_').pop());
      // console.log(provider.instance);
      for (const config of provider.instance) {
        this.logger.log(
          `Mapped {${config.name}}, ${provider.name.split('_').pop()}`,
        );
        const ch = await this.conn.createChannel();
        // console.log('Initialize', config.name);
        const service = await this.moduleRef.create(config.class);
        await service.boot(ch);
        config.instance = ch;
      }
      // console.log(provider.instance)
    }
  }
}
