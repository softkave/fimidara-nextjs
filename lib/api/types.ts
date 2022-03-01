import { IAppError } from "../definitions/system";

export interface IEndpointResultBase {
  errors?: IAppError[];
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
