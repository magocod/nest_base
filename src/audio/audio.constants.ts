import { Job, Queue } from 'bull';

// urls
export const audioTranscodeUrl = 'audio/transcode';

export const audioQueueName = 'audio';

export enum AudioJobNames {
  transcode = 'transcode',
}

export interface AudioJobData {
  file: string;
  log: boolean;
}

export type AudioJobResult = string;

export type AudioJob = Job<AudioJobData>;

export type AudioQueue = Queue<AudioJobData>;
