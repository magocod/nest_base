import { ModuleMetadata, Type } from '@nestjs/common';

export interface WsModuleOptions {
  PORT: number;
}

export interface WsOptionsFactory {
  createWsOptions(): Promise<WsModuleOptions> | WsModuleOptions;
}

export interface WsModuleAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  useExisting?: Type<WsOptionsFactory>;
  useClass?: Type<WsOptionsFactory>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  useFactory?: (...args: any[]) => Promise<WsModuleOptions> | WsModuleOptions;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  inject?: any[];
}
