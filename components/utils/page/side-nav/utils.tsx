import { compact, flatten, isString } from "lodash-es";
import Link from "next/link";
import { IRawNavItem, ISomeNavItem } from "./types.ts";

export function renderRawNavItemLink(item: IRawNavItem, href: string) {
  return <Link href={href}>{item.label}</Link>;
}

export function renderToSideNavItem(item: IRawNavItem): ISomeNavItem {
  const { href, ...itemRest } = item;

  return {
    ...itemRest,
    label: href ? renderRawNavItemLink(item, href) : item.label,
    children: item.children
      ? renderToSideNavMenuItemList(item.children)
      : undefined,
  };
}

export function renderToSideNavMenuItemList(
  items: IRawNavItem[]
): ISomeNavItem[] {
  return compact(
    flatten(
      items.map((item, i) => {
        return [renderToSideNavItem(item)];
      })
    )
  );
}

export function getMenuSelectedKeys(
  menuItems: IRawNavItem[],
  pathname: string,
  selectedKeys: string[] = []
) {
  menuItems.forEach((item) => {
    if (item.href && pathname.startsWith(item.href)) {
      selectedKeys.push(item.key);
    }

    if (item.children) {
      getMenuSelectedKeys(item.children, pathname, selectedKeys);
    }
  });

  return selectedKeys;
}

export function menuListToMap(
  menuItems: ISomeNavItem[],
  parent: string[] = [],
  map: Record<string, ISomeNavItem> = {}
) {
  menuItems.forEach((item) => {
    if (isString(item?.key)) {
      const keyList = parent.concat(item.key);
      const key = keyList.join(".");
      map[key] = item;

      type ItemWithChildren = { children: ISomeNavItem[] };

      if ((item as ItemWithChildren | null)?.children) {
        menuListToMap((item as ItemWithChildren).children, keyList, map);
      }
    }
  });

  return map;
}
