import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { appAccountPaths, appRootPaths } from "../../lib/definitions/system";
import { useAppMenu } from "../app/useAppMenu.tsx";
import { DropdownItems } from "../ui/dropdown-items.tsx";
import { cn } from "../utils.ts";
import IconButton from "../utils/buttons/IconButton";
import { insertAntdMenuDivider } from "../utils/utils";
import styles from "./WebHeader.module.css";
import { Ellipsis } from "lucide-react";

export interface IWebHeaderProps {
  className?: string;
  style?: React.CSSProperties;
}

const WebHeader: React.FC<IWebHeaderProps> = (props) => {
  const { className, style } = props;
  const pathname = usePathname();
  const { isOpen, toggleAppMenu } = useAppMenu();

  let sideLinksNode: React.ReactNode = null;
  const items = insertAntdMenuDivider([
    {
      key: appAccountPaths.signup,
      label: (
        <Link href={appAccountPaths.signup} className="w-full inline-block">
          Signup
        </Link>
      ),
    },
    {
      key: appAccountPaths.login,
      label: (
        <Link href={appAccountPaths.login} className="w-full inline-block">
          Login
        </Link>
      ),
    },
    {
      key: appAccountPaths.forgotPassword,
      label: (
        <Link
          href={appAccountPaths.forgotPassword}
          className="w-full inline-block"
        >
          Forgot Password
        </Link>
      ),
    },
    {
      key: appRootPaths.docs,
      label: (
        <Link href={appRootPaths.docs} className="w-full inline-block">
          Docs
        </Link>
      ),
    },
  ]);

  sideLinksNode = (
    <div className="space-x-4 flex items-center">
      <Link
        href={appAccountPaths.login}
        className="underline decoration-sky-500"
      >
        Login
      </Link>
      <DropdownItems items={items}>
        <IconButton icon={<Ellipsis className="w-4 h-4" />} />
      </DropdownItems>
    </div>
  );

  const isDocs = pathname.startsWith(appRootPaths.docs);
  return (
    <div className={cn(styles.root, "space-x-4", className)} style={style}>
      {isDocs && !isOpen && (
        <IconButton
          icon={isOpen ? <MenuFoldOutlined /> : <MenuUnfoldOutlined />}
          onClick={toggleAppMenu}
        />
      )}
      <div style={{ display: "flex", alignItems: "center" }}>
        <h5 className="text-xl underline decoration-sky-500">
          {isDocs ? null : <Link href={appRootPaths.home}>fimidara</Link>}
        </h5>
      </div>
      <div className={styles.sideLinks}>{sideLinksNode}</div>
    </div>
  );
};

export default WebHeader;
