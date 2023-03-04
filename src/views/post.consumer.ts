import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { PostCategory } from './views.views';
import { ChannelConsumer } from '../rabbitmq/interfaces';
import { Channel, Connection } from 'amqplib';
import { viewTask } from './views.contants';
import { ModuleRef } from '@nestjs/core';

@Injectable()
export class PostConsumer implements ChannelConsumer {
  name = viewTask;
  constructor(
    private moduleRef: ModuleRef,
    private readonly dataSource: DataSource,
  ) {}

  private findAll(): Promise<PostCategory[]> {
    return this.dataSource.manager.find(PostCategory, { take: 2 });
  }

  async boot(conn: Connection): Promise<Channel> {
    return conn.createChannel();
  }

  onModuleInit() {
    console.log('PostConsumer.onModuleInit');
  }
}
