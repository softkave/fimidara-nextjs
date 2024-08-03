"use client";

import { useUserLoggedIn } from "@/lib/hooks/session/useUserLoggedIn.ts";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { SideNav } from "../utils/page/side-nav/SideNav.tsx";
import {
  getMenuSelectedKeys,
  renderToAntDMenuItemList,
} from "../utils/page/side-nav/utils.tsx";
import { getUserNavItems } from "./menu.tsx";
import { useAppMenu } from "./useAppMenu.tsx";
import { getWorkspaceId } from "./utils.ts";

export interface IAppSideNavProps {}

export default function AppSideNav(props: IAppSideNavProps) {
  const { isOpen, toggleAppMenu } = useAppMenu();
  const { isLoggedIn } = useUserLoggedIn();

  const pathname = usePathname();
  const workspaceId = getWorkspaceId(pathname);

  const { antdMenuItems, navItems } = useMemo(() => {
    const navItems = getUserNavItems(workspaceId);
    const antdMenuItems = renderToAntDMenuItemList(
      navItems,
      /** parentItems */ [],
      /** getNavItemPath */ () => ""
    );

    return { navItems, antdMenuItems };
  }, [workspaceId]);

  const selectedKeys = useMemo(() => {
    if (!pathname) {
      return [];
    }

    return getMenuSelectedKeys(navItems, pathname);
  }, [navItems, pathname]);

  if (!isLoggedIn) {
    return null;
  }

  return (
    <SideNav
      items={antdMenuItems}
      onClose={toggleAppMenu}
      title="fimidara"
      selectedKeys={selectedKeys}
      openKeys={selectedKeys}
      isOpen={isOpen}
    />
  );
}
