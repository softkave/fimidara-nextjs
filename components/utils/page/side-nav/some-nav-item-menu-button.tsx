import { SidebarMenuButton } from "@/components/ui/sidebar.tsx";
import Link from "next/link";
import { useCallback } from "react";
import { ISomeNavItem } from "./types.ts";

export interface ISomeNavItemMenuButtonProps {
  item: ISomeNavItem;
  isSelected?: boolean;
  onClick?: (item: ISomeNavItem) => void;
}

export function SomeNavItemMenuButton(props: ISomeNavItemMenuButtonProps) {
  const { item, isSelected, onClick } = props;

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

  return (
    <SidebarMenuButton isActive={isSelected} onClick={handleClick}>
      {menuButton}
    </SidebarMenuButton>
  );
}
