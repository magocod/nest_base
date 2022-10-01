import { SeedModule } from './seed/seed.module';
import { CommandFactory } from 'nest-commander';

async function bootstrap() {
  await CommandFactory.run(SeedModule);
}

bootstrap();
