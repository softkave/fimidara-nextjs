import { appRootPaths } from "@/lib/definitions/system.ts";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import Title from "antd/es/typography/Title";
import { usePathname } from "next/navigation";
import React from "react";
import { cn } from "../utils.ts";
import IconButton from "../utils/buttons/IconButton.tsx";
import styles from "./AppHeader.module.css";
import { useAppMenu } from "./useAppMenu.tsx";
import UserMenu from "./UserMenu.tsx";
import { UploadingFilesProgressButton } from "./workspaces/files/UploadingFilesProgress.tsx";

export interface IAppHeaderProps {
  className?: string;
  style?: React.CSSProperties;
}

export default function AppHeader(props: IAppHeaderProps) {
  const { className, style } = props;
  const { isOpen, toggleAppMenu } = useAppMenu();
  const pathname = usePathname();

  const isDocs = pathname.startsWith(appRootPaths.docs);
  return (
    <div className={cn(styles.root, className)} style={style}>
      <div className={styles.icon}>
        <IconButton
          icon={isOpen ? <MenuFoldOutlined /> : <MenuUnfoldOutlined />}
          onClick={toggleAppMenu}
        />
      </div>
      <div className={styles.headers}>
        <Title level={1} className="my-2 text-xl">
          {isDocs ? "fimidara docs" : "fimidara"}
        </Title>
      </div>
      <div className="flex items-center space-x-2">
        <UploadingFilesProgressButton />
        <UserMenu />
      </div>
    </div>
  );
}
