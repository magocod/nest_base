export type ObjectKey = string | number | symbol;

export type TestQueryString = 'page' | 'perPage' | string;

export type QueryString<T extends ObjectKey = TestQueryString> = {
  [key in T]?: unknown;
};

export const TESTING_DEFAULT_PAGINATION = 3;

export function basicPagination(): QueryString {
  return {
    page: 1,
    perPage: TESTING_DEFAULT_PAGINATION,
  };
}

/**
 * it is not safe to call with empty object,
 * does not perform any invalid data processing
 *
 * @param route
 * @param ob
 */
export function addQueryString(route: string, ob: QueryString): string {
  const [first, ...others] = Object.keys(ob);

  let qs = route + `?${first}=${ob[first]}`;
  for (const k of others) {
    qs = qs + `&${k}=${ob[k]}`;
  }
  return qs;
}
