"use client";

import { kAppAccountPaths } from "@/lib/definitions/paths/account.ts";
import { kAppRootPaths } from "@/lib/definitions/paths/root.ts";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { Ellipsis } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CSSProperties, FC, ReactNode } from "react";
import SignInClient from "../account/sign-in-client.tsx";
import { useAppMenu } from "../app/useAppMenu.tsx";
import { Button } from "../ui/button.tsx";
import { DropdownItems } from "../ui/dropdown-items.tsx";
import { cn } from "../utils.ts";
import IconButton from "../utils/buttons/IconButton";
import { insertMenuDivider } from "../utils/utils";
import styles from "./WebHeader.module.css";

export interface IWebHeaderProps {
  className?: string;
  style?: CSSProperties;
}

const WebHeader: FC<IWebHeaderProps> = (props) => {
  const { className, style } = props;
  const pathname = usePathname();
  const { isOpen, toggleAppMenu } = useAppMenu();

  let sideLinksNode: ReactNode = null;
  const items = insertMenuDivider([
    {
      key: kAppAccountPaths.signup,
      label: (
        <Link href={kAppAccountPaths.signup} className="w-full inline-block">
          Signup with Email
        </Link>
      ),
    },
    {
      key: kAppAccountPaths.login,
      label: (
        <Link href={kAppAccountPaths.login} className="w-full inline-block">
          Login with Email
        </Link>
      ),
    },
    {
      key: "signin-with-google",
      label: (
        <SignInClient className="w-full border-none shadow-none p-0 h-auto" />
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
    <div className="space-x-2 flex items-center">
      <SignInClient className="w-full border-none shadow-none h-auto" />
      <DropdownItems items={items} asChild>
        <Button variant="outline" size="icon" className="px-2">
          <Ellipsis className="w-4 h-4" />
        </Button>
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
