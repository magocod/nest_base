import { Injectable } from '@nestjs/common';
import { CreatePostDto, UpdatePostDto } from './dto';
import { InjectModel } from '@nestjs/sequelize';
import { Post } from './entities';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post)
    private userModel: typeof Post,
  ) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  create(createPostDto: CreatePostDto) {
    return this.userModel.create({ title: 'v' + new Date().getTime() });
  }

  async findAll(): Promise<Post[]> {
    return this.userModel.findAll();
  }

  findOne(id: number) {
    return `This action returns a #${id} post`;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  update(id: number, updatePostDto: UpdatePostDto) {
    return `This action updates a #${id} post`;
  }

  remove(id: number) {
    return `This action removes a #${id} post`;
  }
}
