import { SomeNavItemWithChildren } from "./some-nav-item-with-children.tsx";
import { SomeNavItemWithoutChildren } from "./some-nav-item-without-children.tsx";
import { ISomeNavItem } from "./types.ts";
import { ISomeNavBehaviourProps } from "./useSomeNavBahviour.tsx";

export interface ISomeNavItemProps extends ISomeNavBehaviourProps {
  item: ISomeNavItem;
  isSubItem?: boolean;
}

export function SomeNavItem(props: ISomeNavItemProps) {
  const { item } = props;

  if (item.children?.length) {
    return <SomeNavItemWithChildren {...props} />;
  }

  return <SomeNavItemWithoutChildren {...props} />;
}
