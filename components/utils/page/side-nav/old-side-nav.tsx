import AppTitle from "@/components/app/AppTitle.tsx";
import { ScrollArea } from "@/components/ui/scroll-area.tsx";
import { cn } from "@/components/utils.ts";
import React from "react";
import PageDrawer from "../PageDrawer.tsx";
import { SomeNav } from "./old-some-nav.tsx";
import { ISomeNavItem } from "./types.ts";
import {
  IUseOldSideNavBehaviourProps,
  useOldSideNavBehaviour,
} from "./useOldSideNavBehaviour.tsx";

export interface ISideNavProps extends IUseOldSideNavBehaviourProps {
  title: React.ReactNode;
  items: ISomeNavItem[];
  onClose: () => void;
  hideOnClose?: boolean;
}

export function SideNav(props: ISideNavProps) {
  const { isOpen, title, items, onClose, hideOnClose = true } = props;
  const oldBehaviour = useOldSideNavBehaviour(props);

  const menuNode = (
    <SomeNav
      key={oldBehaviour.key}
      items={items as ISomeNavItem[]}
      style={{ minWidth: isOpen ? "300px" : undefined }}
      className={"h-full py-2"}
      selected={oldBehaviour.selected}
      onSelect={oldBehaviour.handleSelect}
      open={oldBehaviour.open}
      onOpen={oldBehaviour.handleOpen}
    />
  );

  if (oldBehaviour.isLg) {
    if (!isOpen && hideOnClose) {
      return null;
    }

    return (
      <div>
        <AppTitle
          className={cn(
            "py-4",
            "px-4",
            "items-center",
            "flex",
            "sticky top-0 bg-white z-50"
          )}
        />
        <ScrollArea>{menuNode}</ScrollArea>
      </div>
    );
  } else {
    return (
      <PageDrawer open={isOpen} onClose={onClose} title={title}>
        {menuNode}
      </PageDrawer>
    );
  }
}
