import { AlertOutlined, ShopOutlined } from "@ant-design/icons";
import { css } from "@emotion/css";
import { Button, Popover, Space, Tooltip, Typography } from "antd";
import Link from "next/link";
import { appWorkspacePaths } from "../../lib/definitions/system";
import UserCollaborationRequestList from "./requests/UserCollaborationRequestList";
import UserMenu from "./UserMenu";

const classes = {
  root: css({
    display: "flex",
    padding: "16px",
  }),
  sideLinks: css({
    display: "flex",
    flex: 1,
    marginLeft: "16px",
    justifyContent: "flex-end",
  }),
  notifications: css({ minWidth: "260px", minHeight: "200px" }),
};

export default function LoggedInHeader() {
  return (
    <div className={classes.root}>
      <div>
        <Link href={appWorkspacePaths.workspaces} passHref>
          <Typography.Title level={5} style={{ margin: 0, cursor: "pointer" }}>
            fimidara
          </Typography.Title>
        </Link>
      </div>
      <div className={classes.sideLinks}>
        <Space size="middle">
          <Link href={appWorkspacePaths.workspaces} passHref>
            <Tooltip title="Workspaces">
              <Button icon={<ShopOutlined />} />
            </Tooltip>
          </Link>
          <Popover
            trigger={["click"]}
            content={
              <div className={classes.notifications}>
                <UserCollaborationRequestList />
              </div>
            }
            title="Collaboration Requests"
            placement="bottomRight"
          >
            <Tooltip title="Collaboration requests">
              <Button icon={<AlertOutlined />} />
            </Tooltip>
          </Popover>
          <UserMenu />
        </Space>
      </div>
    </div>
  );
}
