import { first, isArray, isString } from "lodash";
import { IAppError } from "../definitions/system";
import OperationError from "./OperationError";
import { flattenErrorList } from "./utils";

export class ServerError extends OperationError {
  public name = "ServerError";
  public message = "Server error";
}

export class ValidationError extends OperationError {
  public name = "ValidationError";
}

export class InvalidCredentialsError extends OperationError {
  public name = "InvalidCredentialsError";
  public message = "Invalid credentials";
}

export class CredentialsExpiredError extends OperationError {
  public name = "CredentialsExpiredError";
  public message = "Credentials expired";
}

export class EmailAddressNotVerifiedError extends OperationError {
  public name = "EmailAddressNotVerifiedError";
  public message =
    "Only read-related actions are permitted for unverified email addresses. " +
    "Please login and go to the Settings page to verify your email address.";
}

export function getFlattenedError(error?: any) {
  const errArray = toAppErrorsArray(error);
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

export const toAppError = (err: Error | IAppError | string): IAppError => {
  const error = isString(err) ? new Error(err) : err;
  return {
    name: error.name,
    message: error.message,
    action: (error as any).action,
    field: (error as any).field,
  };
};

export const toAppErrorsArray = (err: any) => {
  if (!err) {
    return [];
  }

  if (Array.isArray(err)) {
    return err.map((error) => toAppError(error));
  } else {
    return [toAppError(err)];
  }
};
