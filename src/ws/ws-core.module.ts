import {
  DynamicModule,
  Global,
  Module,
  OnApplicationShutdown,
} from '@nestjs/common';
import { WsModuleOptions } from './interfaces';
import {
  createWsServerProvider,
  WebSocketServerWrapper,
} from './ws-server.provider';
import { ModuleRef } from '@nestjs/core';
import { WS_SERVER } from './ws.contants';
// import { WebSocketServer } from 'ws';
// import * as util from 'util';
// import { ConfigModule } from '@nestjs/config';
// import { WsModuleOptions } from './interfaces';
// import { WSS_MODULE_OPTIONS } from './ws.contants';

// TODO complete WsCoreModule

@Global()
@Module({})
export class WsCoreModule implements OnApplicationShutdown {
  constructor(
    // @Inject(WSS_MODULE_OPTIONS)
    // private readonly options: WsModuleOptions,
    private readonly moduleRef: ModuleRef,
  ) {}

  static forRoot(options: WsModuleOptions): DynamicModule {
    // console.log('WS_OPTIONS', options);
    const provider = createWsServerProvider(options);
    return {
      module: WsCoreModule,
      providers: [provider],
      exports: [provider],
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async onApplicationShutdown(signal?: string) {
    const wss: WebSocketServerWrapper = this.moduleRef.get(WS_SERVER);
    // const promiseClose = util.promisify(wss.close);
    // await promiseClose();
    // await new Promise((resolve, reject) => {
    //   wss.close((err) => {
    //     if (err) {
    //       return reject(err);
    //     }
    //
    //     resolve(0);
    //   });
    // });
    if (wss.isBooted()) {
      await new Promise((resolve, reject) => {
        wss.getInstance().close((err) => {
          if (err) {
            return reject(err);
          }

          resolve(0);
        });
      });
    }
  }
}
