import { PlusOutlined } from "@ant-design/icons";
import { css } from "@emotion/css";
import { Typography, Button, Space } from "antd";
import Link from "next/link";
import React from "react";

export interface IListHeaderProps {
  title: string;
  formLinkPath: string;
  actions?: React.ReactNode;
}

const classes = {
  sideLinks: css({
    display: "flex",
    justifyContent: "flex-end",
  }),
  root: css({
    display: "flex",
  }),
  title: css({
    flex: 1,
  }),
};

const ListHeader: React.FC<IListHeaderProps> = (props) => {
  const { title, formLinkPath, actions } = props;
  return (
    <div className={classes.root}>
      <Typography.Title level={5} className={classes.title}>
        {title}
      </Typography.Title>
      <Space className={classes.sideLinks}>
        <Link href={formLinkPath}>
          <Button icon={<PlusOutlined />} />
        </Link>
        {actions}
      </Space>
    </div>
  );
};

export default ListHeader;
