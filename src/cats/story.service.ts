import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Story, StoryDocument } from './entities';
import { Connection, Model } from 'mongoose';
import { PaginationMongoDto } from '../common/dtos';
import { DEFAULT_LIMIT_PAGINATION, PaginationMongo } from '../common/utils';

@Injectable()
export class StoryService {
  constructor(
    @InjectModel(Story.name) private storyModel: Model<StoryDocument>,
    @InjectConnection() private connection: Connection,
  ) {}

  getConnection(): Connection {
    return this.connection;
  }

  getModel(): Model<StoryDocument> {
    return this.storyModel;
  }

  async findAll(paginationDto: PaginationMongoDto) {
    const { limit = DEFAULT_LIMIT_PAGINATION, skip = 0 } = paginationDto;
    const query = this.storyModel.find();

    const total = await query.clone().count().exec();

    query.limit(limit).skip(skip);

    const pagination: PaginationMongo<StoryDocument> = {
      data: await query.exec(),
      limit,
      skip,
      total,
    };

    return pagination;
  }
}
