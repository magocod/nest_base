import {
  DynamicModule,
  // Logger,
  Module,
  // OnApplicationShutdown,
  Provider,
} from '@nestjs/common';
import { WsService } from './ws.service';
import {
  // createWsServerProvider,
  // FakeWsServer,
  wsServerProviders,
} from './ws-server.provider';
// import { ConfigModule } from '@nestjs/config';
import {
  WsModuleAsyncOptions,
  WsModuleOptions,
  WsOptionsFactory,
} from './interfaces';
import {
  // WS_SERVER,
  WSS_MODULE_OPTIONS,
} from './ws.contants';
// import { ModuleRef } from '@nestjs/core';
import { WsCoreModule } from './ws-core.module';

// @Module({
//   providers: [...wsServerProviders, WsService],
//   exports: [...wsServerProviders, WsService],
// })
// export class WsModule {}

@Module({
  providers: [...wsServerProviders, WsService],
  exports: [...wsServerProviders, WsService],
})
export class WsModule {
  // constructor(private readonly moduleRef: ModuleRef) {}

  static register(): DynamicModule {
    // console.log('WS_PORT', process.env.WS_PORT);
    return {
      module: WsModule,
      imports: [],
      providers: [...wsServerProviders, WsService],
      exports: [...wsServerProviders, WsService],
    };
  }

  static registerAsync(options: WsModuleAsyncOptions): DynamicModule {
    // console.log('WS_PORT', process.env.WS_PORT);
    return {
      module: WsModule,
      imports: options.imports || [],
      providers: [
        // ...wsServerProviders,
        // WsService,
        ...this.createAsyncProviders(options),
      ],
      // exports: [...wsServerProviders, WsService],
    };
  }

  private static createAsyncProviders(
    options: WsModuleAsyncOptions,
  ): Provider[] {
    if (options.useExisting || options.useFactory) {
      return [this.createAsyncOptionsProvider(options)];
    }
    return [
      this.createAsyncOptionsProvider(options),
      {
        provide: options.useClass,
        useClass: options.useClass,
      },
    ];
  }

  private static createAsyncOptionsProvider(
    options: WsModuleAsyncOptions,
  ): Provider {
    if (options.useFactory) {
      return {
        provide: WSS_MODULE_OPTIONS,
        useFactory: options.useFactory,
        inject: options.inject || [],
      };
    }
    return {
      provide: WSS_MODULE_OPTIONS,
      useFactory: async (optionsFactory: WsOptionsFactory) =>
        await optionsFactory.createWsOptions(),
      inject: [options.useExisting || options.useClass],
    };
  }

  // onApplicationShutdown(signal?: string) {
  //   // const wss: FakeWsServer = this.moduleRef.get(WS_SERVER);
  // }

  // TODO complete WsCoreModule

  static forRoot(options: WsModuleOptions): DynamicModule {
    // console.log('WS_OPTIONS', options);
    // const provider = createWsServerProvider(options);
    return {
      module: WsModule,
      imports: [WsCoreModule.forRoot(options)],
      // providers: [provider],
      // exports: [provider],
    };
  }

  static forFeature(): DynamicModule {
    return {
      module: WsModule,
      providers: [],
      exports: [],
    };
  }
}
