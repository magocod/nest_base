import { Test, TestingModule } from '@nestjs/testing';
import { NotificationsService } from './notifications.service';

import { NotificationsModule } from './notifications.module';
import { configBaseModules, postgresConfig } from '../app.module';
import { DataSource, Repository } from 'typeorm';
import { Topic } from './entities';
import { faker } from '@faker-js/faker';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('NotificationsService', () => {
  let service: NotificationsService;
  let module: TestingModule;
  let ds: DataSource;
  let topicRepository: Repository<Topic>;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        ...configBaseModules({ ...postgresConfig, websocket: true }),
        NotificationsModule,
      ],
      // providers: [NotificationsService],
    }).compile();

    service = module.get<NotificationsService>(NotificationsService);
    ds = module.get<DataSource>(DataSource);
    topicRepository = module.get(getRepositoryToken(Topic, ds));
  });

  afterEach(async () => {
    await module.close();
  });

  it('find all with, sql raw query', async () => {
    const rs = await service.findAll();

    // console.log(JSON.stringify(rs, null, 2));

    expect(rs.queryRaw).toBeInstanceOf(Array);
    expect(rs.queryRaw.length).toEqual(3);

    expect(Array.isArray(rs.managerQueryRaw)).toEqual(true);
    expect(rs.managerQueryRaw.length).toEqual(4);
  });

  it('transaction example a', async () => {
    const name = faker.datatype.uuid();

    try {
      await ds.transaction(async (transactionalEntityManager) => {
        const tRep = transactionalEntityManager.getRepository(Topic);
        // execute queries using transactionalEntityManager
        await tRep.save(tRep.create({ name }));

        throw new Error('example error');
      });
    } catch (err) {
      // pass
    }

    const topic = await topicRepository.findOne({ where: { name } });
    // console.log(topic);

    expect(topic).toBeNull();
  });

  it('transaction example b', async () => {
    const name = faker.datatype.uuid();

    // create a new query runner
    const queryRunner = ds.createQueryRunner();

    // establish real database connection using our new query runner
    await queryRunner.connect();

    // we can also access entity manager that works with connection created by a query runner:
    const tRep = await queryRunner.manager.getRepository(Topic);

    // open a new transaction:
    await queryRunner.startTransaction();

    try {
      // execute some operations on this transaction:
      await tRep.save(tRep.create({ name }));
      throw new Error('example error');
      // await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
    } finally {
      // you need to release query runner which is manually created:
      await queryRunner.release();
    }

    const topic = await topicRepository.findOne({ where: { name } });
    // console.log(topic);
    expect(topic).toBeNull();
  });
});
