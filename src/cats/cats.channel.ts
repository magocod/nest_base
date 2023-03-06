import { Injectable } from '@nestjs/common';
import { RabbitmqChannel } from '../rabbitmq/rabbitmq.channel';
import { Cat, CatDocument } from './entities';
import { catTasks } from './cats.constants';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ConsumeMessage } from 'amqplib';
import { CreateCatDto } from './dto';

Injectable();
export class CatsChannel extends RabbitmqChannel<Cat> {
  constructor(@InjectModel(Cat.name) private catModel: Model<CatDocument>) {
    super(catTasks);
  }

  async process(payload: ConsumeMessage): Promise<Cat> {
    const createCatDto: CreateCatDto = JSON.parse(payload.content.toString());
    return this.catModel.create(createCatDto);
  }
}
