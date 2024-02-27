import { Menu } from "antd";
import { AppError } from "../../lib/utils/errors";

export type SelectInfo = Parameters<
  Required<React.ComponentProps<typeof Menu>>["onSelect"]
>[0];

export type MenuInfo = Parameters<
  Required<React.ComponentProps<typeof Menu>>["onClick"]
>[0];

export type ElementError =
  | string
  | string[]
  | Error
  | Error[]
  | AppError
  | AppError[];
