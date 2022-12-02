import { DynamicModule, Module, Provider } from '@nestjs/common';
import { WsService } from './ws.service';
import { wsServerProviders } from './ws-server.provider';
// import { ConfigModule } from '@nestjs/config';
import { WsModuleAsyncOptions, WsOptionsFactory } from './interfaces';
import { WSS_MODULE_OPTIONS } from './ws.contants';

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
}
