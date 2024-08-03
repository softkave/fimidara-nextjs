import { css } from "@emotion/css";
import { Badge, Space } from "antd";
import Text from "antd/es/typography/Text";
import { isString } from "lodash-es";
import React from "react";

export interface IAppTabTextProps {
  node: React.ReactNode;
  badgeCount?: number;
}

const classes = {
  text: css({
    textTransform: "capitalize",
  }),
  badge: css({
    backgroundColor: "#1890ff !important",
  }),
};

const AppTabText: React.FC<IAppTabTextProps> = (props) => {
  const { node, badgeCount } = props;
  return (
    <Space>
      {isString(node) ? <Text className={classes.text}>{node}</Text> : node}
      {badgeCount ? (
        <Badge count={badgeCount} className={classes.badge}></Badge>
      ) : null}
    </Space>
  );
};

export default React.memo(AppTabText);
