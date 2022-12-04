import { Inject, Injectable } from '@nestjs/common';
import { FAKE_WS_SERVER, WS_SERVER } from './ws.contants';
import { FakeWsServer, WebSocketServerWrapper } from './ws-server.provider';
// import { WebSocketServer } from 'ws';
import * as WebSocket from 'ws';

@Injectable()
export class WsService {
  constructor(
    @Inject(FAKE_WS_SERVER) public fakeWss: FakeWsServer,
    // @Inject(WS_SERVER) public wss: WebSocketServer,
    @Inject(WS_SERVER) public wss: WebSocketServerWrapper,
  ) {}

  /**
   * broadcasting to all connected WebSocket clients,
   * @param data
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  broadcast(data: any) {
    this.wss.getInstance().clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(data);
      }
    });
  }
}
