import { Command, CommandRunner } from 'nest-commander';
import { SeedService } from './seed.service';

@Command({
  name: 'seed',
  // arguments: '<task>',
  options: { isDefault: false },
})
export class SeedRunner extends CommandRunner {
  constructor(private readonly seedService: SeedService) {
    super();
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async run(inputs: string[], options: Record<string, any>): Promise<void> {
    console.log('call seed');
    const result = await this.seedService.seed();
    console.log(result);
  }
}
