import { css, cx } from "@emotion/css";
import { isString } from "lodash";
import React from "react";
import PageMessage from "../page/PageMessage";
import { StyleableComponentProps } from "../styling/types";
import { appClasses } from "../theme";
import ListHeader from "./ListHeader";

export interface IItemListExportedProps extends StyleableComponentProps {
  emptyMessage?: string | React.ReactNode;
  bordered?: boolean;
  label?: React.ReactNode;
  buttons?: React.ReactNode;
}

export interface IItemListProps<T = any> extends IItemListExportedProps {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  getId?: (item: T, index: number) => string;
}

const classes = {
  root: css({}),
  bordered: css({
    marginBottom: "1px solid black",
  }),
};

function ItemList<T>(props: IItemListProps<T>) {
  const {
    items,
    emptyMessage,
    bordered,
    className,
    style,
    label,
    buttons,
    renderItem,
    getId,
  } = props;

  const handleRenderItem = (item: T, index: number) => {
    let node = renderItem(item, index);
    node =
      bordered && index !== items.length - 1 ? (
        <div className={classes.bordered}>{node}</div>
      ) : (
        node
      );
    return (
      <React.Fragment key={getId ? getId(item, index) : index}>
        {node}
      </React.Fragment>
    );
  };

  let contentNode: React.ReactNode = null;
  let headerNode: React.ReactNode = <ListHeader {...props} />;

  if (items.length === 0) {
    contentNode = isString(emptyMessage) ? (
      <PageMessage message={emptyMessage} />
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

export default ItemList as React.FC<IItemListProps>;
