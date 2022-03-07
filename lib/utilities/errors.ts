import { defaultTo, first, isArray } from "lodash";
import { toAppErrorsArray } from "../api/utils";
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

export function getFlattenedError(error?: any) {
  const errArray = toAppErrorsArray(error);
  const flattenedErrors = flattenErrorList(errArray);
  return flattenedErrors;
}

export function getBaseError(error?: any) {
  return first(defaultTo(getFlattenedError(error)?.error, []));
}

export function getErrorTypes(error: any, types: string[]) {
  const errorList = isArray(error) ? error : [error];
  return errorList.filter((item) => types.includes(item?.name));
}

export function hasErrorTypes(error: any, types: string[]) {
  return getErrorTypes(error, types).length > 0;
}
