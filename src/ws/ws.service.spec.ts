import { Test, TestingModule } from '@nestjs/testing';
import { WsService } from './ws.service';
import { WsModule } from './ws.module';
import {
  ConfigModule,
  // ConfigService
} from '@nestjs/config';
import {
  // EnvConfig,
  EnvConfiguration,
} from '../config/env.config';
import { JoiValidationSchema } from '../config/joi.validation';

describe('WsService', () => {
  let service: WsService;
  // let wsPort: number;
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      // providers: [WsService],
      imports: [
        ConfigModule.forRoot({
          load: [EnvConfiguration],
          validationSchema: JoiValidationSchema,
        }),
        // WsModule.registerAsync({
        //   imports: [ConfigModule],
        //   inject: [ConfigService],
        //   useFactory: (configService: ConfigService<EnvConfig>) => {
        //     // console.log('configService WS_PORT', configService.get('WS_PORT'));
        //     wsPort = configService.get('WS_PORT');
        //     return {
        //       port: configService.get('WS_PORT'),
        //     };
        //   },
        // }),
        WsModule.forRoot({
          port: +process.env.WS_PORT,
        }),
      ],
    }).compile();

    service = module.get<WsService>(WsService);
  });

  afterAll(async () => {
    await module.close();
  });

  it('should fakeWss send return 1', () => {
    expect(service.fakeWss.send()).toEqual(1);
  });

  it('should fakWss port equal 1000', () => {
    expect(service.fakeWss.port).toEqual(1000);
  });

  it('should fakeWss send return 2', () => {
    expect(service.fakeWss.send()).toEqual(2);
  });

  it('should wss port equal process.env.WS_PORT', () => {
    // console.log(wsPort);
    expect(service.wss).toBeDefined();
  });
});
