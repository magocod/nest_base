import { Test, TestingModule } from '@nestjs/testing';
import { PostsController } from './posts.controller';
// import { PostsService } from './posts.service';
import { configBaseModules, mysqlConfig } from '../app.module';
import { PostsModule } from './posts.module';

describe('PostsController', () => {
  let controller: PostsController;
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [...configBaseModules({ ...mysqlConfig }), PostsModule],
      // controllers: [PostsController],
      // providers: [PostsService],
    }).compile();

    controller = module.get<PostsController>(PostsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
