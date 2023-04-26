import { css, cx } from "@emotion/css";
import { Button, Dropdown, Menu, Space, Typography } from "antd";
import Link from "next/link";
import React from "react";
import { BsThreeDots } from "react-icons/bs";
import { appAccountPaths, appRootPaths } from "../../lib/definitions/system";
import { appClasses } from "../utils/theme";

export interface IWebHeaderProps {
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
  prefixBtnContainer: css({
    marginRight: "16px",
  }),
};

const WebHeader: React.FC<IWebHeaderProps> = (props) => {
  const { prefixBtn, className, style } = props;
  let sideLinksNode: React.ReactNode = null;
  sideLinksNode = (
    <Space size={"middle"}>
      <Link href={appAccountPaths.login}>Login</Link>
      <Dropdown
        overlay={
          <Menu>
            <Menu.Item key={appAccountPaths.signup}>
              <Link href={appAccountPaths.signup}>Signup</Link>
            </Menu.Item>
            <Menu.Divider key={"divider-01"} />
            <Menu.Item key={appAccountPaths.login}>
              <Link href={appAccountPaths.login}>Login</Link>
            </Menu.Item>
            <Menu.Divider key={"divider-02"} />
            <Menu.Item key={appAccountPaths.forgotPassword}>
              <Link href={appAccountPaths.forgotPassword}>Forgot Password</Link>
            </Menu.Item>
          </Menu>
        }
        trigger={["click"]}
      >
        <Button icon={<BsThreeDots />} className={appClasses.iconBtn} />
      </Dropdown>
    </Space>
  );

  return (
    <div className={cx(classes.root, className)} style={style}>
      {prefixBtn ? (
        <div className={classes.prefixBtnContainer}>{prefixBtn}</div>
      ) : null}
      <div style={{ display: "flex", alignItems: "center" }}>
        <Link href={appRootPaths.home} passHref={false}>
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
