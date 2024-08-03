import { compact, first, flatten, isString } from "lodash-es";
import Link from "next/link";
import { AntDMenuItem } from "../../types.ts";
import { IRawNavItem } from "./types.ts";

export function renderRawNavItemLink(
  item: IRawNavItem,
  parentItems: IRawNavItem[],
  getNavItemPath: (item: IRawNavItem, parentItems: IRawNavItem[]) => string
) {
  const itemPath = item.href || getNavItemPath(item, parentItems);
  return <Link href={itemPath}>{item.label}</Link>;
}

export function renderToAntDMenuItem(
  item: IRawNavItem,
  parentItems: IRawNavItem[],
  getNavItemPath: (item: IRawNavItem, parentItems: IRawNavItem[]) => string
): AntDMenuItem {
  const { href, withLink, ...itemRest } = item;
  const rootItem = first(parentItems);

  return {
    ...itemRest,
    label:
      withLink || href
        ? renderRawNavItemLink(item, parentItems, getNavItemPath)
        : item.label,
    children: item.children
      ? renderToAntDMenuItemList(
          item.children,
          parentItems.concat(item),
          getNavItemPath
        )
      : undefined,
  };
}

export function renderToAntDMenuItemList(
  items: IRawNavItem[],
  parentItems: IRawNavItem[],
  getNavItemPath: (item: IRawNavItem, parentItems: IRawNavItem[]) => string
): AntDMenuItem[] {
  return compact(
    flatten(
      items.map((item, i) => {
        return [
          renderToAntDMenuItem(item, parentItems, getNavItemPath),
          // i < items.length - 1 ? { type: "divider" } : undefined,
        ];
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
  menuItems: AntDMenuItem[],
  parent: string[] = [],
  map: Record<string, AntDMenuItem> = {}
) {
  menuItems.forEach((item) => {
    if (isString(item?.key)) {
      const keyList = parent.concat(item.key);
      const key = keyList.join(".");
      map[key] = item;

      type ItemWithChildren = { children: AntDMenuItem[] };

      if ((item as ItemWithChildren | null)?.children) {
        menuListToMap((item as ItemWithChildren).children, keyList, map);
      }
    }
  });

  return map;
}
