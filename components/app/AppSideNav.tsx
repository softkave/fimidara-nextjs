"use client";

import { kAppRootPaths } from "@/lib/definitions/paths/root.ts";
import { useUserLoggedIn } from "@/lib/hooks/session/useUserLoggedIn.ts";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { SideNav } from "../utils/page/side-nav/SideNav.tsx";
import {
  getMenuSelectedKeys,
  renderToSideNavMenuItemList,
} from "../utils/page/side-nav/utils.tsx";
import { getInternalNavItems, getUserNavItems } from "./menu.tsx";
import { useAppMenu } from "./useAppMenu.tsx";
import { getWorkspaceId } from "./utils.ts";

export interface IAppSideNavProps {}

export default function AppSideNav(props: IAppSideNavProps) {
  const { isOpen, toggleAppMenu } = useAppMenu();
  const { isLoggedIn } = useUserLoggedIn();

  const pathname = usePathname();
  const workspaceId = getWorkspaceId(pathname);

  const { appMenuItems, navItems } = useMemo(() => {
    const navItems = getUserNavItems(workspaceId);
    const internalItems = pathname.includes(kAppRootPaths.internal)
      ? getInternalNavItems()
      : [];
    const appMenuItems = renderToSideNavMenuItemList(
      navItems.concat(internalItems)
    );

    return { navItems, appMenuItems };
  }, [workspaceId, pathname]);

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
      items={appMenuItems}
      onClose={toggleAppMenu}
      title="fimidara"
      selectedKeys={selectedKeys}
      openKeys={selectedKeys}
      isOpen={isOpen}
    />
  );
}
