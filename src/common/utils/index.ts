export * from './pagination';

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
