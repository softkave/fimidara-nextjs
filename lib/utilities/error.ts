import { toAppErrorsArray } from "../api/utils";
import { flattenErrorList } from "./utils";

export function getBaseError(error?: any) {
  const errArray = toAppErrorsArray(error);
  const flattenedErrors = flattenErrorList(errArray);
  return flattenedErrors?.error;
}
