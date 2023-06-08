export interface IPaginationQuery {
  /**
   * Paginated list page number. Page number is zero-index based, meaning
   * numbering starts from 0, 1, 2, 3, ... Defaults to `0` when not provided.
   */
  page?: number;

  /**
   * Paginated list page size. Minimum value is `1`, and defaults to `1000` when
   * not provided.
   */
  pageSize?: number;
}
