import { Test, TestingModule } from '@nestjs/testing';
import { PostsService } from './posts.service';
import { configBaseModules, mysqlConfig } from '../app.module';
import { PostsModule } from './posts.module';

describe('PostsService', () => {
  let service: PostsService;
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [...configBaseModules({ ...mysqlConfig }), PostsModule],
      // providers: [PostsService],
    }).compile();

    service = module.get<PostsService>(PostsService);
  });

  afterEach(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
