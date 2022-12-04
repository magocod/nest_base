import { FAKE_WS_SERVER, WS_SERVER } from './ws.contants';
import { Provider } from '@nestjs/common';
import { WsModuleOptions } from './interfaces';
import { ServerOptions, WebSocketServer } from 'ws';
import * as WebSocket from 'ws';
// import { ConfigService } from '@nestjs/config';
// import { } from '@nestjs/core'

export class FakeWsServer {
  constructor(public port: number, private count = 0) {}

  send(): number {
    // console.log('fake ws server send')
    this.count++;
    return this.count;
  }

  updateCount(n: number) {
    this.count = n;
  }
}

export const wsServerProviders: Provider[] = [
  {
    provide: FAKE_WS_SERVER,
    useFactory: () => {
      return new FakeWsServer(1000);
    },
  },
  // registerAsync
  // {
  //   provide: WS_SERVER,
  //   useFactory: (
  //     options: WsModuleOptions,
  //     // config
  //   ) => {
  //     const wss = new WebSocketServer({ port: options.port });
  //
  //     wss.on('connection', function connection(ws, req) {
  //       if (req.headers.authentication === undefined) {
  //         ws.send('invalid credentials')
  //         ws.close()
  //         return;
  //       }
  //
  //       ws.on('message', function message(data) {
  //         console.log('received: %s', data);
  //         wss.clients.forEach(function each(client) {
  //           if (client !== ws && client.readyState === WebSocket.OPEN) {
  //             client.send(
  //               JSON.stringify({ message: 'notification other socket' }),
  //             );
  //           }
  //         });
  //       });
  //
  //       ws.send('something');
  //     });
  //
  //     return wss;
  //   },
  //   inject: [
  //     WSS_MODULE_OPTIONS,
  //     // ConfigService
  //   ],
  // },
];

export class WebSocketServerWrapper {
  private instance: WebSocketServer;
  private booted: boolean;

  getInstance(): WebSocketServer {
    return this.instance;
  }

  isBooted(): boolean {
    return this.booted;
  }

  boot(options: ServerOptions) {
    if (this.booted) {
      return;
    }

    const wss = new WebSocketServer(options);

    wss.on('connection', function connection(ws, req) {
      if (req.headers.authentication === undefined) {
        ws.send('invalid credentials');
        ws.close();
        return;
      }

      ws.on('message', function message(data) {
        console.log('received: %s', data);
        wss.clients.forEach(function each(client) {
          if (client !== ws && client.readyState === WebSocket.OPEN) {
            client.send(
              JSON.stringify({
                message:
                  'notification all connected from createWsServerProvider',
              }),
            );
          }
        });
      });

      ws.on('close', function () {
        console.log('socket disconnected');
      });

      ws.send('something');
    });

    this.instance = wss;
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function createWsServerProvider(options: WsModuleOptions): Provider {
  return {
    provide: WS_SERVER,
    useFactory: () => {
      return new WebSocketServerWrapper();
    },
  };
}

// creates a server so fails tests that don't change the port
// export function createWsServerProvider(options: WsModuleOptions): Provider {
//   return {
//     provide: WS_SERVER,
//     useFactory: () => {
//       const wss = new WebSocketServer({
//         port: options.port,
//       });
//
//       wss.on('connection', function connection(ws, req) {
//         if (req.headers.authentication === undefined) {
//           ws.send('invalid credentials');
//           ws.close();
//           return;
//         }
//
//         ws.on('message', function message(data) {
//           console.log('received: %s', data);
//           wss.clients.forEach(function each(client) {
//             if (client !== ws && client.readyState === WebSocket.OPEN) {
//               client.send(
//                 JSON.stringify({
//                   message:
//                     'notification all connected from createWsServerProvider',
//                 }),
//               );
//             }
//           });
//         });
//
//         ws.on('close', function () {
//           console.log('socket disconnected');
//         });
//
//         ws.send('something');
//       });
//
//       return wss;
//     },
//   };
// }
