import { MenuProps } from "antd";

export type SelectedItemsMap = Record<string | number, boolean>;
export interface IItemListLikeComponentProps<T = any> {
  itemClassName?: string;
  padItems?: boolean;
  menu?: MenuProps | ((item: T) => MenuProps);
}
