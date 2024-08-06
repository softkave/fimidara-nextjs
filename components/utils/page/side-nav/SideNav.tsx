import AppTitle from "@/components/app/AppTitle.tsx";
import { cn } from "@/components/utils.ts";
import useAppResponsive from "@/lib/hooks/useAppResponsive.ts";
import { CloseOutlined } from "@ant-design/icons";
import { Drawer, Menu, MenuProps } from "antd";
import Title from "antd/es/typography/Title";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import IconButton from "../../buttons/IconButton.tsx";
import { AntDMenuItem, SelectInfo } from "../../types.ts";
import styles from "./SideNav.module.css";

export type SideNavOnSelect = MenuProps["onSelect"];

export interface ISideNavProps {
  isOpen?: boolean;
  title: React.ReactNode;
  selectedKeys?: string[];
  openKeys?: string[];
  items: AntDMenuItem[];
  onClose: () => void;
  onSelect?: SideNavOnSelect;
  hideOnClose?: boolean;
}

export function SideNav(props: ISideNavProps) {
  const {
    isOpen,
    title,
    selectedKeys,
    openKeys,
    items,
    onClose,
    onSelect,
    hideOnClose = true,
  } = props;
  const responsive = useAppResponsive();
  const isLg = responsive?.lg;
  const defaultOpenKeys = isLg && !isOpen ? undefined : openKeys;
  const [isLgLocal, setLgLocal] = useState(isLg);

  useEffect(() => {
    if (isLg !== isLgLocal) {
      setLgLocal(isLg);

      if (isLgLocal && isOpen) {
        onClose();
      }
    }
  }, [isLg, isLgLocal, isOpen, onClose]);

  const handleSelect = useCallback(
    (info: SelectInfo) => {
      onSelect?.(info);

      if (!isLg) {
        onClose();
      }
    },
    [onSelect, onClose, isLg]
  );

  const key = useMemo(
    () => (defaultOpenKeys ? Math.random() : undefined),
    [defaultOpenKeys]
  );

  const menuNode = (
    <Menu
      key={key}
      items={items}
      mode="inline"
      style={{ minWidth: isOpen ? "300px" : undefined }}
      className={cn(styles.sideNavMenu, "h-full", "py-2")}
      selectedKeys={selectedKeys}
      defaultOpenKeys={defaultOpenKeys}
      inlineCollapsed={!isOpen}
      onSelect={handleSelect}
      inlineIndent={undefined}
    />
  );

  if (isLg) {
    if (!isOpen && hideOnClose) {
      return null;
    }

    return (
      <div className={styles.sideNavDesktopRoot}>
        <AppTitle className={cn("py-4", "px-4", "items-center", "flex")} />
        {menuNode}
      </div>
    );
  } else {
    return (
      <Drawer
        open={isOpen}
        closable={false}
        placement="left"
        onClose={onClose}
        className={styles.sideNavMobileRoot}
      >
        <div className={styles.sideNavMobileRoot02}>
          <div className={styles.sideNavMobileHeader}>
            <Title level={4}>{title}</Title>
            <IconButton icon={<CloseOutlined />} onClick={onClose} />
          </div>
          {menuNode}
        </div>
      </Drawer>
    );
  }
}
