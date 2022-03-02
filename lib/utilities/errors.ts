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

export function getFlattenedError(error?: any) {
  const errArray = toAppErrorsArray(error);
  const flattenedErrors = flattenErrorList(errArray);
  return flattenedErrors;
}

export function getBaseError(error?: any) {
  return getFlattenedError()?.error;
}
