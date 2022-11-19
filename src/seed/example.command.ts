import { Command, CommandRunner } from 'nest-commander';

@Command({
  name: 'example',
  // arguments: '<task>',
  options: { isDefault: false },
})
export class ExampleRunner extends CommandRunner {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
  async run(inputs: string[], options: Record<string, any>): Promise<void> {
    console.log('call example');
  }
}
