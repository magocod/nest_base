export function sortObjectByKeys(object: object): object {
  return Object.fromEntries(Object.entries(object).sort());
}

export function sortObjectStringify(object: object): string {
  return JSON.stringify(sortObjectByKeys(object));
}
