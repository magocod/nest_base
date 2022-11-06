// FIXME env - DEFAULT_PAGINATION
export const DEFAULT_LIMIT_PAGINATION = 5;

export interface Pagination<T> {
  data: T[];
  page: number;
  perPage: number;
  total: number;
}

export interface PaginationMongo<T> {
  data: T[];
  skip: number;
  limit: number;
  total: number;
}

export function generatePagination<T>(
  pag: unknown = 1,
  pageSize: unknown = DEFAULT_LIMIT_PAGINATION,
): { offset: number; pagination: Pagination<T> } {
  let page = 1;
  let offset = 0;
  let limit = DEFAULT_LIMIT_PAGINATION;

  if (pag && pageSize) {
    try {
      // FIXME verify isNaN
      page = parseInt(pag as string);
      limit = parseInt(pageSize as string); // take
      offset = (page - 1) * limit; // skip

      if (offset < 0) {
        // reset default values
        page = 1;
        offset = 0;
        limit = DEFAULT_LIMIT_PAGINATION;
      }
    } catch (e) {
      // pass
    }
  }

  const pagination: Pagination<T> = {
    data: [],
    page,
    perPage: limit,
    total: 0,
  };

  return {
    pagination,
    offset,
  };
}

// for testing

export const PaginationPayloadKeys = Object.keys(generatePagination());

export const PaginationKeys = Object.keys(generatePagination().pagination);

const paginationMongoDb: PaginationMongo<unknown> = {
  data: [],
  limit: 0,
  skip: 0,
  total: 0,
};

export const PaginationMongoKeys = Object.keys(paginationMongoDb);
