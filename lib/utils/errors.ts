import {
  defaultTo,
  first,
  flatten,
  get,
  isArray,
  isObject,
  isString,
  set,
} from "lodash";
import { isFimidaraEndpointError } from "../api/localUtils";
import OperationError from "./OperationError";
import { AnyObject } from "./types";

export class ServerError extends OperationError {
  name = "ServerError";
  message = "Server error";
}

export class ValidationError extends OperationError {
  name = "ValidationError";
}

export class InvalidCredentialsError extends OperationError {
  name = "InvalidCredentialsError";
  message = "Invalid credentials";
}

export class CredentialsExpiredError extends OperationError {
  name = "CredentialsExpiredError";
  message = "Credentials expired";
}

export class EmailAddressNotVerifiedError extends OperationError {
  name = "EmailAddressNotVerifiedError";
  message =
    "Only read-related actions are permitted for unverified email addresses. " +
    "Please login and go to the Settings page to verify your email address";
}

export function getFlattenedError(error?: any) {
  const errArray = toAppErrorList(error);
  const flattenedErrors = flattenErrorList(errArray);
  return flattenedErrors;
}

export function getBaseError(error?: any) {
  if (error?.error) {
    // Error is already flattened
    return error.error;
  }

  const fErrors = getFlattenedError(error);
  const baseErrors = fErrors?.error || [];
  return first(baseErrors);
}

export function getErrorTypes(error: any, types: string[]) {
  const errorList = isArray(error) ? error : [error];
  return errorList.filter((item) => types.includes(item?.name));
}

export function hasErrorTypes(error: any, types: string[]) {
  return getErrorTypes(error, types).length > 0;
}

export const toAppError = (err: Error | AppError | string): AppError[] => {
  if (isFimidaraEndpointError(err)) {
    return flatten(err.errors.map(toAppError));
  }

  const error = isString(err) ? new Error(err) : err;
  return [
    {
      name: error.name,
      message: error.message,
      action: (error as any).action,
      field: (error as any).field,
    },
  ];
};

export const toAppErrorList = (err: any) => {
  if (!err) {
    return [];
  }

  if (Array.isArray(err)) {
    return flatten(err.map((error) => toAppError(error)));
  } else {
    return toAppError(err);
  }
};

export function isError(error: any): error is Error {
  return isObject(error) && isString((error as Error).message);
}

export function getErrorMessage(
  error: any,
  defaultMessage: string = "An error occurred"
) {
  const getMessage = (errorItem: any) => {
    return isError(errorItem)
      ? errorItem.message
      : isString(errorItem)
      ? errorItem
      : defaultMessage;
  };
  return isArray(error) ? getMessage(error[1]) : getMessage(error);
}

export type ErrorLike =
  | string
  | string[]
  | Error
  | Error[]
  | AppError
  | AppError[];

export interface AppError extends Error {
  field?: string;
  action?: string;
  value?: any;
}

export type FlattenedError<
  T extends object = object,
  E extends string | string[] = string[]
> = {
  [K in keyof T]?: NonNullable<T[K]> extends Array<infer T1>
    ? NonNullable<T1> extends object
      ? Array<FlattenedError<NonNullable<T1>>>
      : E
    : NonNullable<T[K]> extends object
    ? FlattenedError<NonNullable<T[K]>>
    : E;
} & { error?: E };

const DEFAULT_FORM_ERROR_FIELD_NAME = "error";

export const flattenErrorList = <T extends AnyObject = AnyObject>(
  errors: AppError[],
  firstErrorOnly = false
): Partial<T> => {
  if (!errors) return {};
  if (errors.length === 0) return {};

  const mappedError = {};

  const getDotLength = (p: string = DEFAULT_FORM_ERROR_FIELD_NAME) => {
    return defaultTo(p, DEFAULT_FORM_ERROR_FIELD_NAME).split(".").length;
  };

  const getChildrenErrorExists = (field: string) => {
    const children = get(mappedError, field);
    return isObject(children);
  };

  const setError = (field: string, errorList: any, errorMessage: string) => {
    if (firstErrorOnly) {
      set(mappedError, field, errorMessage);
    } else if (Array.isArray(errorList)) {
      // Error list already set, only add the new error message
      errorList.push(errorMessage);
    } else {
      errorList = [errorMessage];
      set(mappedError, field, errorList);
    }
  };

  // Sort the errors with fields that subclass other fields (like `first.second`
  // subclassing `first.second.third`) coming after, and the subclassed coming
  // before.
  errors.sort(
    (e1, e2) =>
      (getDotLength(e1.field) - getDotLength(e2.field)) *
      /** Multiply by -1 to reverse ascendancy */ -1
  );
  errors.forEach((error) => {
    const field = error.field || DEFAULT_FORM_ERROR_FIELD_NAME;
    const errorList = get(mappedError, field);
    if (errorList) {
      setError(field, errorList, error.message);
    } else {
      /**
       * We only want to set a field's error if it doesn't contain any children
       * error, basically prioritzing deep errors over shallow ones. For
       * example, if evaluating fields `first.second.third` and `first.second`,
       * and both have errors, only `first.second.third` is going to be included
       * in the flattened errors map because `first.second` subclasses
       * `first.second.third`.
       */
      const childrenExist = getChildrenErrorExists(field);
      if (!childrenExist) {
        setError(field, errorList, error.message);
      }
    }
  });

  return mappedError as T;
};
