import { AppError } from "../utils/errors";

export interface IEndpointResultBase {
  errors?: AppError[];
}

export type GetEndpointResult<T extends object = object> = T &
  IEndpointResultBase;

export type GetEndpointResultError<T extends object = object> = {
  [K in keyof T]?: T[K] extends any[]
    ? T[K][number] extends object
      ? Array<GetEndpointResultError<T[K][number]>>
      : string
    : T[K] extends object
    ? GetEndpointResultError<T[K]>
    : string;
};

export interface IPaginatedResult {
  /**
   * Paginated list page number. Page number is zero-index based, meaning
   * numbering starts from 0, 1, 2, 3, ... Defaults to `0` when not provided.
   */
  page: number;
}

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
