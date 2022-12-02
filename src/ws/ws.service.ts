import { Inject, Injectable } from '@nestjs/common';
import { FAKE_WS_SERVER, WS_SERVER } from './ws.contants';
import { FakeWsServer } from './interfaces';

@Injectable()
export class WsService {
  constructor(
    @Inject(FAKE_WS_SERVER) public fakeWss: FakeWsServer,
    @Inject(WS_SERVER) public wss: FakeWsServer,
  ) {}
}
