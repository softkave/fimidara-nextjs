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
      menuItemContentNode = <Link href={item.href}>{menuItemContentNode}</Link>;
    }

    return (
      <div key={item.key}>
        <div
          className={cn(
            "space-x-2 flex items-center py-0.5 px-4 hover:bg-slate-200",
            someBehaviour.checkIsSelected(item.key) && "bg-slate-200"
          )}
        >
          {item.children?.length ? (
            <span onClick={() => someBehaviour.handleOpen(item)}>
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
            {...someBehaviour}
            key={item.key}
          />
        ) : null}
      </div>
    );
  });

  return (
    <div className={className} style={style}>
      {navNodes}
    </div>
  );
}
