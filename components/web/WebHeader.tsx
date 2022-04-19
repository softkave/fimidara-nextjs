import React from "react";
import { Typography, Space, Dropdown, Menu, Button } from "antd";
import Link from "next/link";
import { css } from "@emotion/css";
import { appAccountPaths, appRootPaths } from "../../lib/definitions/system";
import { BsThreeDots } from "react-icons/bs";
import { appClasses } from "../utils/theme";

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
};

export default function WebHeader() {
  // const responsive = useResponsive() as unknown as
  //   | IUseResponsiveResult
  //   | undefined;
  let sideLinksNode: React.ReactNode = null;

  // if (responsive?.lg) {
  //   sideLinksNode = (
  //     <Space size={"middle"}>
  //       <Link href={appAccountPaths.signup}>Signup</Link>
  //       <Link href={appAccountPaths.login}>Login</Link>
  //       <Link href={appAccountPaths.forgotPassword}>Forgot Password</Link>
  //     </Space>
  //   );
  // } else {
  //   sideLinksNode = (
  //     <Space size={"middle"}>
  //       <Link href={appAccountPaths.login}>Login</Link>
  //       <Dropdown
  //         overlay={
  //           <Menu>
  //             <Menu.Item>
  //               <Link href={appAccountPaths.signup}>Signup</Link>
  //             </Menu.Item>
  //             <Menu.Divider />
  //             <Menu.Item>
  //               <Link href={appAccountPaths.login}>Login</Link>
  //             </Menu.Item>
  //             <Menu.Divider />
  //             <Menu.Item>
  //               <Link href={appAccountPaths.forgotPassword}>
  //                 Forgot Password
  //               </Link>
  //             </Menu.Item>
  //           </Menu>
  //         }
  //         trigger={["click"]}
  //       >
  //         <Button icon={<EllipsisOutlined />} />
  //       </Dropdown>
  //     </Space>
  //   );
  // }

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
    <div className={classes.root}>
      <div>
        <Link href={appRootPaths.home} passHref={false}>
          <Typography.Title level={5} style={{ margin: 0 }}>
            Fimidara
          </Typography.Title>
        </Link>
      </div>
      <div className={classes.sideLinks}>{sideLinksNode}</div>
    </div>
  );
}
