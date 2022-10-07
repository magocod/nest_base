export function sortObjectByKeys(object: object) {
  return Object.fromEntries(Object.entries(object).sort());
}

export function sortObjectStringify(object: object) {
  return JSON.stringify(sortObjectByKeys(object));
}
