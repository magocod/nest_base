import { NestFactory } from '@nestjs/core';
import { SeedModule } from './seed.module';
// import { UsersService } from '../auth/users.service';
import { SeedService } from './seed.service';
import { Logger } from '@nestjs/common';

const runSeed = async () => {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(SeedModule);

  // run
  const seedService = await app.get(SeedService);
  // console.log(await seedService.seed());
  logger.log('start ...');
  logger.log(await seedService.seed());

  // const user = await app.get(UsersService);
  // console.log(await user.findAll({}));

  await app.close();
  logger.log('completed');
};

void runSeed();
