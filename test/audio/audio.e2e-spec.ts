import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule, configApp, globalPrefix } from '../../src/app.module';
import { ApiRouteVersion } from '../../src/app.constants';
import supertest from 'supertest';
import {
  AudioJobNames,
  AudioJobResult,
  AudioQueue,
  audioQueueName,
  audioTranscodeUrl,
} from '../../src/audio/audio.constants';
import { AudioTranscodeDto } from '../../src/audio/dto';
import { faker } from '@faker-js/faker';
import {
  getQueueToken,
  OnQueueCompleted,
  Process,
  Processor,
} from '@nestjs/bull';
import { AudioProcessor } from '../../src/audio/audio.processor';
import { fakeJobJson } from '../moks';
import { Job } from 'bull';
import { AudioConsumer } from '../../src/audio/audio.consumer';
import { EventEmitter } from 'events';

const baseRoute = `/${globalPrefix}/${ApiRouteVersion.v1}`;
const audioTranscodeRoute = `${baseRoute}/${audioTranscodeUrl}`;

// export function queueProcessorMock() {
//   return {
//     handleTranscode: jest.fn().mockImplementation(() => {
//       console.log('call mock AudioProcessor');
//       return 'transcode:mock.mp3';
//     }),
//   };
// }

const processorEvent = 'processor';
const consumerEvent = 'consumer';

@Processor(audioQueueName)
export class AudioProcessorMock {
  constructor(private eventEmitter: EventEmitter) {}

  @Process(AudioJobNames.transcode)
  handleTranscode(): AudioJobResult {
    // console.log('call AudioProcessorMock');
    this.eventEmitter.emit(processorEvent);
    return 'transcode:mock.mp3';
  }
}

@Processor(audioQueueName)
export class AudioConsumerMock {
  constructor(private eventEmitter: EventEmitter) {}

  @OnQueueCompleted()
  handleTranscode() {
    // console.log('call AudioConsumerMock');
    this.eventEmitter.emit(consumerEvent);
  }
}

export class ProcessorMock {}

export class ConsumerMock {}

// export function createPartialDone(
//   count: number,
//   // done: CallableFunction,
//   done: jest.DoneCallback,
//   callback?: CallableFunction,
// ) {
//   let i = 0;
//   return () => {
//     if (++i === count) {
//       if (callback !== undefined) {
//         callback();
//       }
//       done();
//     }
//   };
// }

describe('Audio - /audio (e2e)', () => {
  let app: INestApplication;
  let httpClient: supertest.SuperTest<supertest.Test>;
  let queue: AudioQueue;
  // let processor: AudioProcessor;

  const myEmitter = new EventEmitter();

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
      // providers: [
      //   {
      //     provide: AudioProcessor,
      //     useValue: queueProcessorMock(),
      //   },
      // ],
    })
      // .overrideProvider(getQueueToken(audioQueueName))
      // .useValue(queueMock())
      // .overrideProvider(AudioProcessor)
      // .useValue(queueProcessorMock())
      // .overrideProvider(AudioProcessor)
      // .useValue(new AudioProcessorMock(myEmitter))
      // .overrideProvider(AudioConsumer)
      // .useValue(new AudioConsumerMock(myEmitter))
      .overrideProvider(AudioProcessor)
      .useValue(new ProcessorMock())
      .overrideProvider(AudioConsumer)
      .useValue(new ConsumerMock())
      .compile();

    app = moduleFixture.createNestApplication();
    configApp(app);

    httpClient = request(app.getHttpServer());

    queue = moduleFixture.get<AudioQueue>(getQueueToken(audioQueueName));
    // console.log(queue);
    // processor = moduleFixture.get<AudioProcessor>(AudioProcessor);
    // console.log(processor)

    await app.init();
  });

  afterEach(() => {
    myEmitter
      .removeAllListeners(processorEvent)
      .removeAllListeners(consumerEvent);
    // restore the spy created with spyOn
    // jest.restoreAllMocks();
  });

  afterAll(async () => {
    await app.close();
  });

  // it('/transcode, callback', (done) => {
  //   let response: supertest.Response;
  //
  //   // processor and consumer events = 2
  //   const partialDone = createPartialDone(2, done, () => {
  //     // expect(response.status).toEqual(HttpStatus.CREATED);
  //     expect(response.body.id).toBeDefined();
  //   });
  //
  //   // const spy = jest
  //   //   .spyOn(processor, 'handleTranscode')
  //   //   .mockImplementation(() => {
  //   //     console.log('call mock AudioProcessor');
  //   //     return 'transcode:mock.mp3';
  //   //   });
  //   // const spy = jest.spyOn(queue, 'add').mockImplementation((name, data) => {
  //   //   console.log('call mock queue');
  //   //   // console.log(data)
  //   //   return Promise.resolve(
  //   //     fakeJobJson(name as string, data),
  //   //   ) as unknown as Promise<Job>;
  //   // });
  //   // const spy = jest.spyOn(processor, 'handleTranscode');
  //
  //   myEmitter.on(processorEvent, () => {
  //     // console.log('AudioProcessorMock called!');
  //     // expect(args).toEqual(1);
  //     // done();
  //     partialDone();
  //   });
  //
  //   myEmitter.on(consumerEvent, () => {
  //     // console.log('AudioConsumerMock called!');
  //     // expect(args).toEqual(1);
  //     // done();
  //     partialDone();
  //   });
  //
  //   const reqData: AudioTranscodeDto = {
  //     file: faker.datatype.uuid() + '.mp4',
  //     log: false,
  //   };
  //   httpClient
  //     .post(audioTranscodeRoute)
  //     .send(reqData)
  //     .expect(HttpStatus.CREATED)
  //     .then((res) => {
  //       response = res;
  //       // console.log('http req end -> response', response.body.id, response.status);
  //       // expect(response.status).toEqual(HttpStatus.CREATED);
  //       // expect(response.body.id).toBeDefined();
  //     })
  //     .catch((e) => {
  //       // spy.mockRestore();
  //       // expect(spy).toHaveBeenCalledTimes(2);
  //       // console.log('test error end');
  //       done(e);
  //     });
  // }, 8000);

  it('/transcode, async await', async () => {
    // const spy = jest
    //   .spyOn(processor, 'handleTranscode')
    //   .mockImplementation(() => {
    //     console.log('call mock AudioProcessor');
    //     return 'transcode:mock.mp3';
    //   });
    const spy = jest.spyOn(queue, 'add').mockImplementation((name, data) => {
      // console.log('call mock queue');
      // console.log(data)
      return Promise.resolve(
        fakeJobJson(name as string, data),
      ) as unknown as Promise<Job>;
    });
    // const spy = jest.spyOn(processor, 'handleTranscode');

    const reqData: AudioTranscodeDto = {
      file: faker.datatype.uuid() + '.mp4',
      log: false,
    };
    const response = await httpClient.post(audioTranscodeRoute).send(reqData);
    // console.log('response', response.body.id);

    spy.mockRestore();
    // expect(spy).toHaveBeenCalledTimes(2);
    expect(response.status).toEqual(HttpStatus.CREATED);
    expect(response.body.id).toBeDefined();
    // console.log('test end')
  });
});
