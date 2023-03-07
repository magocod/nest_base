// TODO RabbitmqProducer decorator
export function RabbitmqProducer(extra: string) {
  // eslint-disable-next-line @typescript-eslint/ban-types, @typescript-eslint/no-unused-vars
  return (target: Function) => {
    console.log('RabbitmqProducer: ' + extra);
  };
}
