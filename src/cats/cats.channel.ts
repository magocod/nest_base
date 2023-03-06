import { Injectable, Logger } from '@nestjs/common';
import { RabbitmqChannel } from '../rabbitmq/rabbitmq.channel';
import { Cat, CatDocument } from './entities';
import { catTasks } from './cats.constants';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ConsumeMessage } from 'amqplib';
import { CreateCatDto } from './dto';

Injectable();
export class CatsChannel extends RabbitmqChannel<Cat> {
  public logger = new Logger('CatsChannel');
  constructor(@InjectModel(Cat.name) private catModel: Model<CatDocument>) {
    super(catTasks);
  }

  async process(payload: ConsumeMessage): Promise<Cat> {
    const createCatDto: CreateCatDto = JSON.parse(payload.content.toString());
    // throw new Error('example error in process');
    return this.catModel.create(createCatDto);
  }

  async onSuccess(result: Cat) {
    // throw new Error('example error in onSuccess');
    this.logger.log(result);
  }

  // async onError(error: Error) {
  //
  // }
}
