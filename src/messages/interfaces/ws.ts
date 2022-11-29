import { Server, Socket } from 'socket.io';
import { CommonClientToServerEvents } from '../../common/interfaces';
import { Message } from '../entities';

export enum MessageEvents {
  clientsUpdated = 'clientsUpdated',
  messageFromClient = 'messageFromClient',
  messageFromClientException = 'messageFromClientException',
  createMessage = 'createMessage',
}

export interface MessageServerToClientEvents {
  clientsUpdated: (socketIds: string[]) => void;
  messageFromServer(payload: { fullName: string; message: string }): void;
  messageFromServerMongo(payload: { fullName: string; message: Message }): void;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface MessageClientToServerEvents
  extends CommonClientToServerEvents {}

export type MessageWsServer = Server<
  MessageClientToServerEvents,
  MessageServerToClientEvents
>;

export type MessageSocket = Socket<
  MessageServerToClientEvents,
  MessageClientToServerEvents
>;
