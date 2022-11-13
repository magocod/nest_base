import { Job, Queue } from 'bull';

export const audioQueueName = 'audio';

export enum AudioJobNames {
  transcode = 'transcode',
}

export interface AudioJobData {
  file: string;
  log: boolean;
}

export type AudioJobResult = number;

export type AudioJob = Job<AudioJobData>;

export type AudioQueue = Queue<AudioJobData>;
