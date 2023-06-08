import { AnyFn } from "@/lib/utils/types";
import { css, cx } from "@emotion/css";
import React from "react";
import { StyleableComponentProps } from "../styling/types";

export type AppTabItem = {
  key: string;
  label: React.ReactNode;
  icon?: React.ReactNode;
};

export interface AppTabsProps extends StyleableComponentProps {
  activeKey: string;
  activeKeyClassName?: string;
  itemClassName?: string;
  items: Array<AppTabItem>;
  onChange: AnyFn<[string, AppTabItem], void>;
}

const classes = {
  root: css({
    display: "flex",
    flexDirection: "row",
  }),
  item: css({
    display: "inline-flex",
    alignItems: "center",
    margin: "0px 16px",
    lineHeight: "32px",
    padding: "4px 0px",
    cursor: "pointer",

    "&:first-of-type": {
      marginLeft: "0px",
    },
    "&:last-of-type": {
      marginRight: "0px",
    },
  }),
  active: css({
    color: "#1677ff",
    fontWeight: "bold",
  }),
  icon: css({
    display: "inline-flex",
    alignItems: "center",
    marginRight: "8px",
    lineHeight: "32px",

    "& svg": {
      fontSize: "14px",
    },
  }),
};

const AppTabs: React.FC<AppTabsProps> = (props) => {
  const {
    activeKey,
    activeKeyClassName,
    itemClassName,
    items,
    style,
    className,
    onChange,
  } = props;

  const itemsNode = items.map((item) => {
    const active = item.key === activeKey;
    return (
      <div
        key={item.key}
        onClick={() => onChange(item.key, item)}
        className={cx(
          classes.item,
          active && classes.active,
          itemClassName,
          active && activeKeyClassName
        )}
      >
        {item.icon && <span className={classes.icon}>{item.icon}</span>}
        {item.label}
      </div>
    );
  });
  return (
    <div style={style} className={cx(classes.root, className)}>
      {itemsNode}
    </div>
  );
};

export default AppTabs;
