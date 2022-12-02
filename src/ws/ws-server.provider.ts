import { FAKE_WS_SERVER, WSS_MODULE_OPTIONS, WS_SERVER } from './ws.contants';
import { Provider } from '@nestjs/common';
import { WsModuleOptions } from './interfaces';
// import { ConfigService } from '@nestjs/config';

export const wsServerProviders: Provider[] = [
  {
    provide: FAKE_WS_SERVER,
    useFactory: () => {
      return {
        port: 1000,
        booted: true,
        send: () => {
          // console.log('send fakeWss notification');
          return 1;
        },
      };
    },
  },
  {
    provide: WS_SERVER,
    useFactory: (
      options: WsModuleOptions,
      // config
    ) => {
      // console.log('options', options);
      // console.log('config', config);
      return {
        port: options.PORT,
        booted: true,
        send: () => {
          // console.log('send wss notification');
          return 2;
        },
      };
    },
    inject: [
      WSS_MODULE_OPTIONS,
      // ConfigService
    ],
  },
];
