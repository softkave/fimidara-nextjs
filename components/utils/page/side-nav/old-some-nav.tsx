import { cn } from "@/components/utils.ts";
import { ChevronDown, ChevronRight } from "lucide-react";
import Link from "next/link";
import { StyleableComponentProps } from "../../styling/types.ts";
import { ISomeNavItem } from "./types.ts";
import {
  ISomeNavBehaviourProps,
  useSomeNavBehaviour,
} from "./useSomeNavBahviour.tsx";

export interface ISomeNavProps
  extends StyleableComponentProps,
    ISomeNavBehaviourProps {
  items: Array<ISomeNavItem>;
}

export function SomeNav(props: ISomeNavProps) {
  const { items, className, style } = props;
  const someBehaviour = useSomeNavBehaviour(props);

  const navNodes = items.map((item) => {
    if (item.isDivider) {
      return <div className="h-px bg-gray-200 my-2" key={item.key} />;
    }

    let menuItemContentNode = (
      <div
        className="space-x-2 flex items-center flex-1"
        onClick={() => someBehaviour.handleSelect(item)}
      >
        {item.icon && (
          <span className="inline-flex items-center justify-center h-8">
            {item.icon}
          </span>
        )}
        <span className="inline-flex items-center justify-start h-8 flex-1">
          {item.label}
        </span>
      </div>
    );

    if (item.href) {
      menuItemContentNode = (
        <Link href={item.href} className="flex flex-1">
          {menuItemContentNode}
        </Link>
      );
    }

    return (
      <div key={item.key} className="flex flex-col">
        <div
          className={cn(
            "space-x-2 flex flex-1 items-center py-1 px-4 hover:bg-gray-100",
            someBehaviour.checkIsSelected(item.key) && "bg-gray-100 font-bold"
          )}
        >
          {item.children?.length ? (
            <span
              onClick={() => someBehaviour.handleOpen(item)}
              className="cursor-pointer text-muted-foreground"
            >
              {someBehaviour.checkIsOpen(item.key) ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </span>
          ) : null}
          {menuItemContentNode}
        </div>
        {item.children?.length && someBehaviour.checkIsOpen(item.key) ? (
          <SomeNav
            items={item.children}
            className="ml-6"
            key={item.key}
            onOpen={props.onOpen}
            onSelect={props.onSelect}
            open={props.open}
            selected={props.selected}
            openMap={someBehaviour.openMap}
            selectedMap={someBehaviour.selectedMap}
          />
        ) : null}
      </div>
    );
  });

  return (
    <div className={cn(className, "flex flex-col flex-1")} style={style}>
      {navNodes}
    </div>
  );
}
