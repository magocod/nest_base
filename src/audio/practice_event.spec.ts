import { EventEmitter } from 'events';

describe('practice_event', function () {
  const myEmitter = new EventEmitter();

  afterEach(() => {
    myEmitter.removeAllListeners('event');
  });

  it('done ok', (done) => {
    // const myEmitter = new EventEmitter();
    myEmitter.on('event', (args) => {
      // console.log(args);
      // console.log('an event occurred!', args);
      expect(args).toEqual(1);
      done();
    });

    myEmitter.emit('event', 1);
  });

  // it('done error', (done) => {
  //   // const myEmitter = new EventEmitter();
  //   myEmitter.on('event', () => {
  //     console.log('an event occurred!');
  //     // done();
  //   });
  //
  //   myEmitter.emit('event');
  // }, 1000)
});
