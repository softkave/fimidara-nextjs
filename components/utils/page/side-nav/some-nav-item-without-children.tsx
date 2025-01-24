import {
  SidebarMenuItem,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar.tsx";
import { SomeNavItemMenuButton } from "./some-nav-item-menu-button.tsx";
import { ISomeNavItem } from "./types.ts";
import {
  ISomeNavBehaviourProps,
  useSomeNavBehaviour,
} from "./useSomeNavBahviour.tsx";

export interface ISomeNavItemWithoutChildrenProps
  extends ISomeNavBehaviourProps {
  item: ISomeNavItem;
  isSubItem?: boolean;
}

export function SomeNavItemWithoutChildren(
  props: ISomeNavItemWithoutChildrenProps
) {
  const { item, isSubItem = false } = props;
  const someNavBehaviour = useSomeNavBehaviour(props);

  const isSelected = someNavBehaviour.checkIsSelected(item.key);

  const MenuItem = isSubItem ? SidebarMenuSubItem : SidebarMenuItem;

  return (
    <MenuItem>
      <SomeNavItemMenuButton
        item={item}
        isSelected={isSelected}
        onClick={someNavBehaviour.handleSelect}
        isSubItem={isSubItem}
      />
    </MenuItem>
  );
}
