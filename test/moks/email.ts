import { ISendMailOptions } from '@nestjs-modules/mailer';

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error
export class ConnectionError extends Error {
  code: string;

  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  constructor(...params: any) {
    // Pass remaining arguments (including vendor specific ones) to parent constructor
    super(...params);

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ConnectionError);
    }

    this.name = 'BaseError';
    // Custom debugging information
    this.code = 'ESOCKET';
  }
}

export function fakeEmail(payload: ISendMailOptions) {
  // console.log('payload', payload);
  return {
    accepted: [payload.to],
    rejected: [],
    envelopeTime: 1062,
    messageTime: 657,
    messageSize: 345,
    response: '250 2.0.0 Ok: queued',
    envelope: {
      from: 'noreply@mailtrap.io',
      to: [payload.to],
    },
    messageId: '<mock-bba20713-4102-a177-a287-cc39ad694842@mailtrap.io>',
  };
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function fakeEmailException(payload) {
  throw new ConnectionError('error message');
}

export function mailerServiceMock() {
  return {
    sendMail: jest.fn().mockImplementation(fakeEmail),
  };
}
