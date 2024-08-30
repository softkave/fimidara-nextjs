import { Dropdown, MenuProps } from "antd";
import Title from "antd/es/typography/Title";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { BsThreeDots } from "react-icons/bs";
import { appAccountPaths, appRootPaths } from "../../lib/definitions/system";
import { Button } from "../ui/button.tsx";
import { cn } from "../utils.ts";
import IconButton from "../utils/buttons/IconButton";
import { appClasses } from "../utils/theme";
import { insertAntdMenuDivider } from "../utils/utils";
import styles from "./WebHeader.module.css";

export interface IWebHeaderProps {
  className?: string;
  style?: React.CSSProperties;
}

const WebHeader: React.FC<IWebHeaderProps> = (props) => {
  const { className, style } = props;
  const pathname = usePathname();

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
    {
      key: appRootPaths.docs,
      label: <Link href={appRootPaths.docs}>Docs</Link>,
    },
  ]);

  sideLinksNode = (
    <div className="space-x-2 flex items-center">
      <Link href={appAccountPaths.login}>
        <Button variant="link">Login</Button>
      </Link>
      <Dropdown trigger={["click"]} menu={{ items }} placement="bottomRight">
        <IconButton icon={<BsThreeDots />} className={appClasses.iconBtn} />
      </Dropdown>
    </div>
  );

  const isDocs = pathname.startsWith(appRootPaths.docs);
  return (
    <div className={cn(styles.root, className)} style={style}>
      <div style={{ display: "flex", alignItems: "center" }}>
        <Link href={appRootPaths.home}>
          <Title level={5} style={{ margin: 0, cursor: "pointer" }}>
            <Link href={isDocs ? appRootPaths.docs : appRootPaths.home}>
              {isDocs ? "fimidara docs" : "fimidara"}
            </Link>
          </Title>
        </Link>
      </div>
      <div className={styles.sideLinks}>{sideLinksNode}</div>
    </div>
  );
};

export default WebHeader;
