import { faker } from '@faker-js/faker';

export function fakeJobJson(name: string, data: unknown) {
  return {
    id: 'mock_' + faker.datatype.uuid(),
    name,
    data,
    opts: {
      attempts: 1,
      delay: 0,
      timestamp: 1668471430170,
    },
    progress: 0,
    delay: 0,
    timestamp: 1668471430170,
    attemptsMade: 0,
    stacktrace: [],
    returnvalue: null,
    finishedOn: null,
    processedOn: null,
  };
}

export function queueMock() {
  return {
    add: jest.fn(),
    process: jest.fn(),
    on: jest.fn(),
  };
}
