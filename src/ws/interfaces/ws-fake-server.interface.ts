export interface FakeWsServer {
  port: number;
  booted: boolean;
  send(): number;
}
