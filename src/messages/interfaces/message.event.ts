import { Server, Socket } from 'socket.io';
import { CommonClientToServerEvents } from '../../common/interfaces';
import { Message } from '../entities';

// messages

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

// groups

export enum GroupEvents {
  messageFromClientGroup = 'messageFromClientGroup',
}

export interface GroupServerToClientEvents {
  messageFromServerGroup(payload: {
    fullName: string;
    message: string;
    group: boolean;
  }): void;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface GroupClientToServerEvents extends CommonClientToServerEvents {}

// server

export type WsServer = Server<
  MessageClientToServerEvents & GroupClientToServerEvents,
  MessageServerToClientEvents & GroupServerToClientEvents
>;

export type WsSocket = Socket<
  MessageServerToClientEvents & GroupServerToClientEvents,
  MessageClientToServerEvents & GroupClientToServerEvents
>;
