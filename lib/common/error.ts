import { isObject } from "lodash-es";
import { AnyObject } from "softkave-js-utils";

export const kOwnError = Symbol("OwnError");
export const kOwnServerError = Symbol("OwnServerError");

export class OwnError extends Error {
  static isOwnError(error: unknown): error is OwnError {
    return isObject(error) && (error as AnyObject)[kOwnError] === true;
  }

  [kOwnError]: true = true as const;

  constructor(message: string) {
    super(message);
  }
}

export class OwnServerError extends OwnError {
  static isOwnServerError(error: unknown): error is OwnServerError {
    return (
      OwnError.isOwnError(error) &&
      (error as AnyObject)[kOwnServerError] === true
    );
  }

  [kOwnServerError]: true = true as const;
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}
