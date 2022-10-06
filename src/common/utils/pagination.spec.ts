import { generatePagination, DEFAULT_LIMIT_PAGINATION } from './pagination';

describe('pagination', function () {
  describe('generatePagination', function () {
    it('only require parameters', function () {
      const payload = generatePagination(5);
      expect(payload.pagination.page).toEqual(5);
      expect(payload.pagination.perPage).toEqual(DEFAULT_LIMIT_PAGINATION);
      expect(payload.offset).toEqual(20);
    });

    it('first page', function () {
      const qsA = {
        page: 1,
        pageSize: 3,
      };
      const payloadA = generatePagination(qsA.page, qsA.pageSize);
      expect(payloadA.pagination.page).toEqual(1);
      expect(payloadA.offset).toEqual(0);
    });

    it('second page', function () {
      const qsB = {
        page: 2,
        pageSize: 3,
      };
      const payloadB = generatePagination(qsB.page, qsB.pageSize);
      expect(payloadB.pagination.page).toEqual(2);
      expect(payloadB.offset).toEqual(3);
    });

    it('all parameters equal to 0', function () {
      const qsC = {
        page: 0,
        pageSize: 0,
      };
      const payloadC = generatePagination(qsC.page, qsC.pageSize);
      expect(payloadC.pagination.page).toEqual(1);
      expect(payloadC.offset).toEqual(0);
    });

    it('invalid parameters', function () {
      const payloadUndefined = generatePagination(undefined, undefined);
      const payloadNull = generatePagination(null, null);

      expect(payloadUndefined.pagination.page).toEqual(1);
      expect(payloadUndefined.pagination.perPage).toEqual(
        DEFAULT_LIMIT_PAGINATION,
      );
      expect(payloadUndefined.offset).toEqual(0);
      expect(payloadNull.pagination.page).toEqual(1);
      expect(payloadNull.pagination.perPage).toEqual(DEFAULT_LIMIT_PAGINATION);
      expect(payloadNull.offset).toEqual(0);
    });

    // page equal to 0
    // limit equal to 0
  });
});
