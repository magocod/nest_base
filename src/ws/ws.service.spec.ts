import { Test, TestingModule } from '@nestjs/testing';
import { WsService } from './ws.service';
import { WsModule } from './ws.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EnvConfig, EnvConfiguration } from '../config/env.config';
import { JoiValidationSchema } from '../config/joi.validation';

describe('WsService', () => {
  let service: WsService;
  let wsPort: number;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      // providers: [WsService],
      imports: [
        ConfigModule.forRoot({
          load: [EnvConfiguration],
          validationSchema: JoiValidationSchema,
        }),
        WsModule.registerAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: (configService: ConfigService<EnvConfig>) => {
            // console.log('configService WS_PORT', configService.get('WS_PORT'));
            wsPort = configService.get('WS_PORT');
            return {
              PORT: configService.get('WS_PORT'),
            };
          },
        }),
      ],
    }).compile();

    service = module.get<WsService>(WsService);
  });

  it('should fakeWss send return 1', () => {
    expect(service.fakeWss.send()).toEqual(1);
  });

  it('should fakWss port equal 1000', () => {
    expect(service.fakeWss.port).toEqual(1000);
  });

  it('should wss send return 2', () => {
    expect(service.wss.send()).toEqual(2);
  });

  it('should wss port equal process.env.WS_PORT', () => {
    // console.log(wsPort);
    expect(service.wss.port).toEqual(wsPort);
  });
});
