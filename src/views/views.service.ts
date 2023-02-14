import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { PostCategory } from './views.views';

@Injectable()
export class ViewsService {
  constructor(private readonly dataSource: DataSource) {}

  findAll(): Promise<PostCategory[]> {
    return this.dataSource.manager.find(PostCategory, { take: 2 });
  }
}
