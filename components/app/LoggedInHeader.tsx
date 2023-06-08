import { AlertOutlined, ShopOutlined } from "@ant-design/icons";
import { css, cx } from "@emotion/css";
import { Popover, Space, Tooltip, Typography } from "antd";
import Link from "next/link";
import { appWorkspacePaths } from "../../lib/definitions/system";
import IconButton from "../utils/buttons/IconButton";
import UserMenu from "./UserMenu";
import UserCollaborationRequestList from "./requests/UserCollaborationRequestList";

export interface ILoggedInHeaderProps {
  prefixBtn?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

const classes = {
  root: css({
    display: "flex",
    padding: "16px",
    borderBottom: "1px solid rgba(0, 0, 0, 0.06)",
  }),
  sideLinks: css({
    display: "flex",
    flex: 1,
    marginLeft: "16px",
    justifyContent: "flex-end",
  }),
  notifications: css({ minWidth: "260px", minHeight: "200px" }),
  prefixBtnContainer: css({
    marginRight: "16px",
  }),
};

export default function LoggedInHeader(props: ILoggedInHeaderProps) {
  const { prefixBtn, className, style } = props;
  return (
    <div className={cx(classes.root, className)} style={style}>
      {prefixBtn ? (
        <div className={classes.prefixBtnContainer}>{prefixBtn}</div>
      ) : null}
      <div>
        <Link href={appWorkspacePaths.workspaces}>
          <Typography.Title level={5} style={{ margin: 0, cursor: "pointer" }}>
            fimidara
          </Typography.Title>
        </Link>
      </div>
      <div className={classes.sideLinks}>
        <Space size="middle">
          <Link href={appWorkspacePaths.workspaces}>
            <Tooltip title="Workspaces">
              <IconButton icon={<ShopOutlined />} />
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
            <Tooltip title="Collaboration Requests">
              <IconButton icon={<AlertOutlined />} />
            </Tooltip>
          </Popover>
          <UserMenu />
        </Space>
      </div>
    </div>
  );
}
