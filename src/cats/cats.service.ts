import { Inject, Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { CreateCatDto, PaginationCatDto, UpdateCatDto } from './dto';
import { Cat, CatDocument } from './entities';
import { Connection, Model, PipelineStage } from 'mongoose';
import { PaginationMongoDto } from '../common/dtos';
import { DEFAULT_LIMIT_PAGINATION, PaginationMongo } from '../common/utils';
import { CountStageResult } from '../common/interfaces';
import { CatAggregateResult } from './interfaces';
import { RABBITMQ_SENDER } from '../rabbitmq/rabbitmq.constants';
import { Channel } from 'amqplib';
import { catTasks } from './cats.constants';
// import { RabbitmqProducer } from '../rabbitmq/decorators';

// @RabbitmqProducer('extra')
@Injectable()
export class CatsService {
  constructor(
    @InjectModel(Cat.name) private catModel: Model<CatDocument>,
    @InjectConnection() private connection: Connection,
    @Inject(RABBITMQ_SENDER) public sender: Channel,
  ) {}

  getConnection(): Connection {
    return this.connection;
  }

  getModel(): Model<CatDocument> {
    return this.catModel;
  }

  async create(createCatDto: CreateCatDto) {
    const createdCat = await this.catModel.create(createCatDto);
    // ...
    return createdCat;
  }

  async createWithQueue(createCatDto: CreateCatDto) {
    return this.sender.sendToQueue(
      catTasks,
      Buffer.from(JSON.stringify(createCatDto)),
    );
  }

  async findAll(paginationDto: PaginationMongoDto) {
    const { limit = DEFAULT_LIMIT_PAGINATION, skip = 0 } = paginationDto;
    const query = this.catModel.find();

    const total = await query.clone().count().exec();

    query.limit(limit).skip(skip);

    // if (paginationDto.limit !== undefined) {
    //   query.limit(paginationDto.limit);
    // }
    //
    // if (paginationDto.skip !== undefined) {
    //   query.skip(paginationDto.skip);
    // }

    query.populate('owner');

    const pagination: PaginationMongo<CatDocument> = {
      data: await query.exec(),
      limit,
      skip,
      total,
    };

    return pagination;
  }

  findOne(id: number) {
    return `This action returns a #${id} cat`;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  update(id: number, updateCatDto: UpdateCatDto) {
    return `This action updates a #${id} cat`;
  }

  remove(id: number) {
    return `This action removes a #${id} cat`;
  }

  async findAllAggregate(paginationDto: PaginationCatDto) {
    const {
      limit = DEFAULT_LIMIT_PAGINATION,
      skip = 0,
      withOwner,
      withStories,
    } = paginationDto;
    const pipeline: PipelineStage[] = [];
    const countResult = await this.catModel.aggregate<CountStageResult>([
      ...pipeline,
      {
        $count: 'total',
      },
    ]);

    const catPipeline = [
      ...pipeline,
      {
        $limit: limit,
      },
      {
        $skip: skip,
      },
    ];

    if (withOwner) {
      catPipeline.push(
        {
          $lookup: {
            from: 'owners',
            localField: 'owner',
            foreignField: '_id',
            as: 'ownerData',
          },
        },
        { $unwind: '$ownerData' },
      );
    }

    if (withStories) {
      catPipeline.push({
        $lookup: {
          from: 'stories',
          localField: '_id',
          foreignField: 'cat',
          as: 'stories',
        },
      });
    }

    const aggregate = await this.catModel.aggregate<CatAggregateResult>(
      catPipeline,
    );

    const pagination: PaginationMongo<CatAggregateResult> = {
      data: aggregate,
      limit,
      skip,
      total: countResult.length > 0 ? countResult[0].total : 0,
    };

    return pagination;
  }
}
