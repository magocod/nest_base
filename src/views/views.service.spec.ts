import { Test, TestingModule } from '@nestjs/testing';
import { ViewsService } from './views.service';
import { configBaseModules, postgresConfig } from '../app.module';
import { ViewsModule } from './views.module';
import { DataSource } from 'typeorm';
import { Category, Post } from './entities';
import { PostCategory } from './views.views';
import { faker } from '@faker-js/faker';

async function config(dataSource: DataSource) {
  const category1 = new Category();
  category1.name = faker.animal.cat();
  await dataSource.manager.save(category1);

  const category2 = new Category();
  category2.name = faker.animal.dog();
  await dataSource.manager.save(category2);

  const post1 = new Post();
  post1.name = faker.datatype.uuid();
  post1.categoryId = category1.id;
  await dataSource.manager.save(post1);

  const post2 = new Post();
  post2.name = faker.datatype.uuid();
  post2.categoryId = category2.id;
  await dataSource.manager.save(post2);

  return { category1 };
}

describe('ViewsService', () => {
  let service: ViewsService;
  let module: TestingModule;
  let ds: DataSource;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [...configBaseModules({ ...postgresConfig }), ViewsModule],
      // providers: [ViewsService],
    }).compile();

    service = module.get<ViewsService>(ViewsService);
    ds = module.get<DataSource>(DataSource);
  });

  afterAll(async () => {
    await module.close();
  });

  it('find all with view', async () => {
    const { category1 } = await config(ds);

    const postCategories = await service.findAll();
    const postCategory = await ds.manager.findOneBy(PostCategory, {
      id: category1.id,
    });

    // console.log(JSON.stringify(postCategories, null, 2));
    // console.log(JSON.stringify(postCategory, null, 2));

    expect(postCategories).toBeInstanceOf(Array);
    expect(postCategory).toBeInstanceOf(PostCategory);
  });
});
