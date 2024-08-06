import { appRootPaths, appWorkspacePaths } from "@/lib/definitions/system.ts";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import Title from "antd/es/typography/Title";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { cn } from "../utils.ts";
import IconButton from "../utils/buttons/IconButton.tsx";
import styles from "./AppTitle.module.css";
import { useAppMenu } from "./useAppMenu.tsx";

export interface IAppTitleProps {
  className?: string;
  style?: React.CSSProperties;
}

export default function AppTitle(props: IAppTitleProps) {
  const { className, style } = props;
  const { isOpen, toggleAppMenu } = useAppMenu();
  const pathname = usePathname();

  const isDocs = pathname.startsWith(appRootPaths.docs);
  return (
    <div
      className={cn("flex", "items-center", "space-x-4", className)}
      style={style}
    >
      <IconButton
        icon={isOpen ? <MenuFoldOutlined /> : <MenuUnfoldOutlined />}
        onClick={toggleAppMenu}
      />
      <div className={styles.headers}>
        <Title level={1} className="text-xl m-0">
          <Link
            href={isDocs ? appRootPaths.docs : appWorkspacePaths.workspaces}
            className="text-inherit"
          >
            {isDocs ? "fimidara docs" : "fimidara"}
          </Link>
        </Title>
      </div>
    </div>
  );
}
