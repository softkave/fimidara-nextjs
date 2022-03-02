import { AlertOutlined } from "@ant-design/icons";
import { css } from "@emotion/css";
import { Button, Dropdown, Space, Typography } from "antd";
import Link from "next/link";
import React from "react";
import { appOrgPaths } from "../../lib/definitions/system";
import CollaborationRequestList from "./requests/CollaborationRequestList";
import UserMenu from "./UserMenu";

const classes = {
  root: css({
    display: "flex",
  }),
  sideLinks: css({
    display: "flex",
    flex: 1,
    marginLeft: "16px",
    justifyContent: "flex-end",
  }),
};

// TODO: implement unseen notifications chip

export default function AppHeader() {
  return (
    <div className={classes.root}>
      <div>
        <Link href={appOrgPaths.orgs}>
          <Typography.Title level={5} style={{ margin: 0 }}>
            Files Backend
          </Typography.Title>
        </Link>
      </div>
      <div className={classes.sideLinks}>
        <Space size="middle">
          <Dropdown trigger={["click"]} overlay={<CollaborationRequestList />}>
            <Button icon={<AlertOutlined />} />
          </Dropdown>
          <UserMenu />
        </Space>
      </div>
    </div>
  );
}
