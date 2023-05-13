import { css, cx } from "@emotion/css";
import { Dropdown, MenuProps, Space, Typography } from "antd";
import Link from "next/link";
import React from "react";
import { BsThreeDots } from "react-icons/bs";
import { appAccountPaths, appRootPaths } from "../../lib/definitions/system";
import IconButton from "../utils/buttons/IconButton";
import { appClasses } from "../utils/theme";
import { insertAntdMenuDivider } from "../utils/utils";

export interface IWebHeaderProps {
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
  prefixBtnContainer: css({
    marginRight: "16px",
  }),
};

const WebHeader: React.FC<IWebHeaderProps> = (props) => {
  const { className, style } = props;
  let sideLinksNode: React.ReactNode = null;
  const items: MenuProps["items"] = insertAntdMenuDivider([
    {
      key: appAccountPaths.signup,
      label: <Link href={appAccountPaths.signup}>Signup</Link>,
    },
    {
      key: appAccountPaths.login,
      label: <Link href={appAccountPaths.login}>Login</Link>,
    },
    {
      key: appAccountPaths.forgotPassword,
      label: <Link href={appAccountPaths.forgotPassword}>Forgot Password</Link>,
    },
  ]);

  sideLinksNode = (
    <Space size={"middle"}>
      <Link href={appAccountPaths.login}>Login</Link>
      <Dropdown trigger={["click"]} menu={{ items }} placement="bottomRight">
        <IconButton icon={<BsThreeDots />} className={appClasses.iconBtn} />
      </Dropdown>
    </Space>
  );

  return (
    <div className={cx(classes.root, className)} style={style}>
      <div style={{ display: "flex", alignItems: "center" }}>
        <Link href={appRootPaths.home}>
          <Typography.Title level={5} style={{ margin: 0, cursor: "pointer" }}>
            fimidara
          </Typography.Title>
        </Link>
      </div>
      <div className={classes.sideLinks}>{sideLinksNode}</div>
    </div>
  );
};

export default WebHeader;
