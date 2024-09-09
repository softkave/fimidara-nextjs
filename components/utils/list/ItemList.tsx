import { cn } from "@/components/utils.ts";
import { isString } from "lodash-es";
import React from "react";
import PageEmpty from "../page/PageEmpty";
import { StyleableComponentProps } from "../styling/types";
import ListHeader from "./ListHeader";

export interface IItemListExportedProps extends StyleableComponentProps {
  emptyMessage?: string | React.ReactNode;
  bordered?: boolean;
  itemClassName?: string;
  itemStyle?: React.CSSProperties;
}

export interface IItemListProps<T = any> extends IItemListExportedProps {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  getId?: (item: T, index: number) => string;
  space?: "sm" | "md";
}

function ItemList<T>(props: IItemListProps<T>) {
  const {
    items,
    emptyMessage,
    bordered,
    className,
    style,
    itemClassName,
    itemStyle,
    renderItem,
    getId,
    space,
  } = props;

  const handleRenderItem = (item: T, index: number) => {
    let node = renderItem(item, index);

    if (node === null) {
      return node;
    }

    return (
      <div
        key={getId ? getId(item, index) : index}
        className={cn(
          space === "sm" && "py-2",
          space === "md" && "py-4",
          bordered && index !== items.length - 1 && "border-b border-input",
          itemClassName
        )}
        style={itemStyle}
      >
        {node}
      </div>
    );
  };

  let contentNode: React.ReactNode = null;
  let headerNode: React.ReactNode = <ListHeader {...props} />;

  if (items.length === 0) {
    contentNode = isString(emptyMessage) ? (
      <PageEmpty message={emptyMessage} />
    ) : (
      emptyMessage
    );
  } else {
    contentNode = items.map(handleRenderItem);
  }

  return (
    <div style={style} className={cn("flex flex-col w-full", className)}>
      {headerNode}
      {contentNode}
    </div>
  );
}

export default ItemList;
