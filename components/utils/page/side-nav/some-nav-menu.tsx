import {
  Sidebar,
  SidebarContent,
  SidebarMenu,
} from "@/components/ui/sidebar.tsx";
import { SomeNavItem } from "./some-nav-item.tsx";
import { ISomeNavItem } from "./types.ts";
import { ISomeNavBehaviourProps } from "./useSomeNavBahviour.tsx";

export interface ISomeNavMenuProps extends ISomeNavBehaviourProps {
  items: ISomeNavItem[];
}

export function SomeNavMenu(props: ISomeNavMenuProps) {
  const { items } = props;

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarMenu>
          {items.map((item) => (
            <SomeNavItem key={item.key} {...props} item={item} />
          ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}
