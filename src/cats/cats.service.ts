import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateCatDto, UpdateCatDto } from './dto';
import { Cat, CatDocument } from './entities/cat.schema';
import { Model } from 'mongoose';
import { PaginationMongoDto } from '../common/dtos/pagination.dto';
import { DEFAULT_LIMIT_PAGINATION, PaginationMongo } from '../common/utils';

@Injectable()
export class CatsService {
  constructor(@InjectModel(Cat.name) private catModel: Model<CatDocument>) {}

  getModel(): Model<CatDocument> {
    return this.catModel;
  }

  async create(createCatDto: CreateCatDto) {
    const createdCat = await this.catModel.create(createCatDto);
    // ...
    return createdCat;
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

  update(id: number, updateCatDto: UpdateCatDto) {
    return `This action updates a #${id} cat`;
  }

  remove(id: number) {
    return `This action removes a #${id} cat`;
  }
}
