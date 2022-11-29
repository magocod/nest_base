// export interface CommonServerToClientEvents {}

export interface CommonClientToServerEvents {
  exception: (payload: {
    status: string;
    message: string;
    exception: string;
  }) => void;
}
