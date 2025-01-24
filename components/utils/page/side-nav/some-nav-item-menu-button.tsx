import {
  SidebarMenuButton,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar.tsx";
import Link from "next/link";
import { useCallback } from "react";
import { ISomeNavItem } from "./types.ts";

export interface ISomeNavItemMenuButtonProps {
  item: ISomeNavItem;
  isSelected?: boolean;
  onClick?: (item: ISomeNavItem) => void;
  isSubItem?: boolean;
}

export function SomeNavItemMenuButton(props: ISomeNavItemMenuButtonProps) {
  const { item, isSelected, onClick, isSubItem } = props;

  const handleClick = useCallback(() => {
    onClick?.(item);
  }, [onClick, item]);

  let menuButton = (
    <span>
      {item.icon}
      {item.label}
    </span>
  );

  if (item.href) {
    menuButton = <Link href={item.href}>{menuButton}</Link>;
  }

  const MenuButton = isSubItem ? SidebarMenuSubButton : SidebarMenuButton;

  return (
    <MenuButton isActive={isSelected} onClick={handleClick}>
      {menuButton}
    </MenuButton>
  );
}
