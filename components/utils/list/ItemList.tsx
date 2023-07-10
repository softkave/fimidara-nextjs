import { css, cx } from "@emotion/css";
import { isString } from "lodash";
import React from "react";
import PageEmpty from "../page/PageEmpty";
import { StyleableComponentProps } from "../styling/types";
import { appClasses } from "../theme";
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
}

const classes = {
  root: css({}),
  bordered: css({
    borderBottom: "1px solid #f0f0f0",
  }),
  item: css({
    padding: "16px 0px",

    "&:first-of-type": {
      paddingTop: "0px",
    },
    "&:last-of-type": {
      paddingBottom: "0px",
    },
  }),
};

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
  } = props;

  const handleRenderItem = (item: T, index: number) => {
    let node = renderItem(item, index);

    if (node === null) {
      return node;
    }

    return (
      <div
        key={getId ? getId(item, index) : index}
        className={cx(
          classes.item,
          bordered && index !== items.length - 1 && classes.bordered,
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
    <div
      style={style}
      className={cx(className, appClasses.pageListRoot, classes.root)}
    >
      {headerNode}
      {contentNode}
    </div>
  );
}

export default ItemList;
