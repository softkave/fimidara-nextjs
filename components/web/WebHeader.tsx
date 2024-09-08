import { kAppRootPaths } from "@/lib/definitions/paths/root.ts";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { Ellipsis } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { kAppAccountPaths } from "../../lib/definitions/system";
import { useAppMenu } from "../app/useAppMenu.tsx";
import { DropdownItems } from "../ui/dropdown-items.tsx";
import { cn } from "../utils.ts";
import IconButton from "../utils/buttons/IconButton";
import { insertAntdMenuDivider } from "../utils/utils";
import styles from "./WebHeader.module.css";

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
      key: kAppAccountPaths.signup,
      label: (
        <Link href={kAppAccountPaths.signup} className="w-full inline-block">
          Signup
        </Link>
      ),
    },
    {
      key: kAppAccountPaths.login,
      label: (
        <Link href={kAppAccountPaths.login} className="w-full inline-block">
          Login
        </Link>
      ),
    },
    {
      key: kAppAccountPaths.forgotPassword,
      label: (
        <Link
          href={kAppAccountPaths.forgotPassword}
          className="w-full inline-block"
        >
          Forgot Password
        </Link>
      ),
    },
    {
      key: kAppRootPaths.docs,
      label: (
        <Link href={kAppRootPaths.docs} className="w-full inline-block">
          Docs
        </Link>
      ),
    },
  ]);

  sideLinksNode = (
    <div className="space-x-4 flex items-center">
      <Link
        href={kAppAccountPaths.login}
        className="underline decoration-sky-500"
      >
        Login
      </Link>
      <DropdownItems items={items}>
        <IconButton icon={<Ellipsis className="w-4 h-4" />} />
      </DropdownItems>
    </div>
  );

  const isDocs = pathname.startsWith(kAppRootPaths.docs);
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
          {isDocs ? null : <Link href={kAppRootPaths.home}>fimidara</Link>}
        </h5>
      </div>
      <div className={styles.sideLinks}>{sideLinksNode}</div>
    </div>
  );
};

export default WebHeader;
