"use client";

import { kAppAccountPaths } from "@/lib/definitions/paths/account.ts";
import { kAppRootPaths } from "@/lib/definitions/paths/root.ts";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import {
  BookTextIcon,
  Ellipsis,
  KeyIcon,
  LogInIcon,
  UserPlusIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CSSProperties, FC, ReactNode } from "react";
import GitHubSignInClient from "../account/github-sign-in-client.tsx";
import GoogleSignInClient from "../account/google-sign-in-client.tsx";
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
        <Link
          href={kAppAccountPaths.signup}
          className="w-full inline-flex items-center gap-4"
        >
          <UserPlusIcon className="w-4 h-4" />
          <span className="hidden md:block">Signup</span>
        </Link>
      ),
    },
    {
      key: kAppAccountPaths.login,
      label: (
        <Link
          href={kAppAccountPaths.login}
          className="w-full inline-flex items-center gap-4"
        >
          <LogInIcon className="w-4 h-4" />
          <span className="hidden md:block">Login</span>
        </Link>
      ),
    },
    {
      key: "signin-with-google",
      label: (
        <GoogleSignInClient className="w-full border-none shadow-none p-0 h-auto" />
      ),
    },
    {
      key: "signin-with-github",
      label: (
        <GitHubSignInClient className="w-full border-none shadow-none p-0 h-auto" />
      ),
    },
    {
      key: kAppAccountPaths.forgotPassword,
      label: (
        <Link
          href={kAppAccountPaths.forgotPassword}
          className="w-full inline-flex items-center gap-4"
        >
          <KeyIcon className="w-4 h-4" />
          <span className="hidden md:block">Forgot Password</span>
        </Link>
      ),
    },
    {
      key: kAppRootPaths.docs,
      label: (
        <Link
          href={kAppRootPaths.docs}
          className="w-full inline-flex items-center gap-4"
        >
          <BookTextIcon className="w-4 h-4" />
          <span className="hidden md:block">Docs</span>
        </Link>
      ),
    },
  ]);

  sideLinksNode = (
    <div className="space-x-2 flex items-center">
      {/* <GoogleSignInClient className="w-full border-none shadow-none h-auto" /> */}
      <GitHubSignInClient className="w-full h-8" />
      <DropdownItems items={items} asChild>
        <Button variant="outline" size="icon" className="px-2">
          <Ellipsis className="w-4 h-4" />
        </Button>
      </DropdownItems>
    </div>
  );

  const isDocs = pathname.startsWith(kAppRootPaths.docs);

  return (
    <div
      className={cn("p-4 space-x-4 flex items-center", className)}
      style={style}
    >
      {isDocs && !isOpen && (
        <IconButton
          icon={isOpen ? <MenuFoldOutlined /> : <MenuUnfoldOutlined />}
          onClick={toggleAppMenu}
        />
      )}
      <div style={{ display: "flex", alignItems: "center" }}>
        <h5 className="text-xl underline">
          {isDocs ? null : <Link href={kAppRootPaths.home}>fimidara</Link>}
        </h5>
      </div>
      <div className={styles.sideLinks}>{sideLinksNode}</div>
    </div>
  );
};

export default WebHeader;
