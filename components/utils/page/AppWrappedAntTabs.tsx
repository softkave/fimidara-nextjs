/*eslint no-useless-computed-key: "off"*/

import { css } from "@emotion/css";
import { Tabs, TabsProps } from "antd";
import React from "react";
import { FiMoreHorizontal } from "react-icons/fi";
import CustomIcon from "../buttons/CustomIcon";
import IconButton from "../buttons/IconButton";
import AppTabText from "./AppTabText";

type Tab = Required<TabsProps>["items"][number];
export interface AppWrappedAntTabItem extends Tab {
  badgeCount?: number;
}

export interface AppWrappedAntTabsProps
  extends Pick<TabsProps, "activeKey" | "onChange"> {
  items: Array<AppWrappedAntTabItem>;
}

const classes = {
  root: css({
    height: "100%",
    "& .ant-tabs-tabpane, & .ant-tabs-content": {
      height: "100%",
    },
  }),
};

const AppWrappedAntTabs: React.FC<AppWrappedAntTabsProps> = (props) => {
  const { items } = props;
  return (
    <Tabs
      {...props}
      moreIcon={
        <IconButton icon={<CustomIcon icon={<FiMoreHorizontal />} />} />
      }
      tabBarExtraContent={{
        left: <div style={{ marginLeft: "16px" }} />,
      }}
      items={items.map((item) => ({
        ...item,
        label: <AppTabText node={item.label} badgeCount={item.badgeCount} />,
      }))}
      className={classes.root}
    />
  );
};

export default React.memo(AppWrappedAntTabs);
