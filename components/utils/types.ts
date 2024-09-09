import { AppError } from "../../lib/utils/errors";

export type ElementError =
  | string
  | string[]
  | Error
  | Error[]
  | AppError
  | AppError[];
