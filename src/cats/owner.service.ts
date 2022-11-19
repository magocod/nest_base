import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import {
  CatDocument,
  Owner,
  OwnerDocument,
  OwnerDocumentGeneric,
} from './entities';
import { Connection, Model, Query } from 'mongoose';
import { DEFAULT_LIMIT_PAGINATION, PaginationMongo } from '../common/utils';
import { PaginationOwnerDto } from './dto';

@Injectable()
export class OwnerService {
  constructor(
    @InjectModel(Owner.name) private ownerModel: Model<OwnerDocument>,
    @InjectConnection() private connection: Connection,
  ) {}

  getConnection(): Connection {
    return this.connection;
  }

  getModel(): Model<OwnerDocument> {
    return this.ownerModel;
  }

  async findAll(paginationDto: PaginationOwnerDto) {
    const {
      limit = DEFAULT_LIMIT_PAGINATION,
      skip = 0,
      withCats,
    } = paginationDto;
    const query: Query<
      OwnerDocumentGeneric<CatDocument>[],
      // eslint-disable-next-line  @typescript-eslint/no-explicit-any
      any,
      Record<string, unknown>, // {},
      OwnerDocument
    > = this.ownerModel.find();

    const total = await query.clone().count().exec();

    query.limit(limit).skip(skip);

    if (withCats) {
      query.populate<{ cats: CatDocument }>('cats');
    }

    // const data = await query.clone().exec();
    // const o = data[1];
    // console.log(o.cats[0].name);

    const pagination: PaginationMongo<OwnerDocumentGeneric<CatDocument>> = {
      data: await query.exec(),
      limit,
      skip,
      total,
    };

    return pagination;
  }
}
