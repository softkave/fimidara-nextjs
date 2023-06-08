import { ItemType } from "antd/lib/menu/hooks/useItems";
import { compact, first, flatten, forEach, get, last, set } from "lodash";
import Link from "next/link";
import { isObjectEmpty } from "../../lib/utils/fns";
import { htmlCharacterCodes } from "../utils/utils";
import restApiTableOfContent from "./raw/toc/v1/table-of-content.json";
import { IRawNavItem } from "./types";

export const DOCS_BASE_PATH = "/docs";

export function getNavItemPath(item: IRawNavItem, rootItem: IRawNavItem) {
  return `${DOCS_BASE_PATH}/${rootItem.key}/${item.key}`;
}

export function renderRawNavItemLink(item: IRawNavItem, rootItem: IRawNavItem) {
  const itemPath = getNavItemPath(item, rootItem);
  return <Link href={itemPath}>{item.label}</Link>;
}

function renderToAntDMenuItem(
  item: IRawNavItem,
  rootItem: IRawNavItem
): ItemType {
  const { withLink, ...itemRest } = item;
  return {
    ...itemRest,
    label: withLink ? renderRawNavItemLink(item, rootItem) : item.label,
    children: item.children
      ? renderToAntDMenuItemList(item.children, rootItem)
      : undefined,
  };
}

function renderToAntDMenuItemList(
  items: IRawNavItem[],
  rootItem: IRawNavItem
): ItemType[] {
  return compact(
    flatten(
      items.map((item, i) => {
        return [
          renderToAntDMenuItem(item, rootItem),
          i < items.length - 1 ? { type: "divider" } : undefined,
        ];
      })
    )
  );
}

export const restApiRawNavItems = extractRestApiFromRawTableOfContent(
  restApiTableOfContent as any
);

export const fimidaraNavItems: IRawNavItem[] = [
  {
    key: "fimidara",
    label: "fimidara",
    children: [
      {
        withLink: true,
        label: "Introduction",
        key: "introduction",
      },
      {
        withLink: true,
        label: "Workspace",
        key: "workspace",
      },
      {
        withLink: true,
        label: "Permissions and Access Control",
        key: "permissions-and-access-control",
      },
    ],
  },
];
export const fimidaraRestApiNavItems: IRawNavItem[] = [
  {
    key: "fimidara-rest-api",
    label: "fimidara REST API",
    children: (
      [
        {
          withLink: true,
          label: "overview",
          key: "",
        },
      ] as IRawNavItem[]
    ).concat(restApiRawNavItems),
  },
];
export const fimidaraJsSdkNavItems: IRawNavItem[] = [
  {
    key: "fimidara-js-sdk",
    label: "fimidara JS SDK",
    children: (
      [
        {
          withLink: true,
          label: "overview",
          key: "",
        },
      ] as IRawNavItem[]
    ).concat(restApiRawNavItems),
  },
];

export const fimidaraAntdNavItems = renderToAntDMenuItemList(
  fimidaraNavItems,
  first(fimidaraNavItems)!
);
export const fimidaraRestApiAntdNavItems = renderToAntDMenuItemList(
  fimidaraRestApiNavItems,
  first(fimidaraRestApiNavItems)!
);
export const fimidaraJsSdkAntdNavItems = renderToAntDMenuItemList(
  fimidaraJsSdkNavItems,
  first(fimidaraJsSdkNavItems)!
);

function extractRestApiFromRawTableOfContent(records: Array<[string, string]>) {
  interface RawNavItemWithRecord {
    key: string;
    label: React.ReactNode;
    withLink?: boolean;
    children?: Record<string, RawNavItemWithRecord>;
  }

  const links: IRawNavItem[] = [];
  const linksMap: Record<string, RawNavItemWithRecord> = {};

  function setEntry(endpointPath: string, endpointMethod: string) {
    const [e01, version, ...rest] = endpointPath.split("/");
    const fnName = last(rest);

    rest.forEach((k0, index) => {
      const k1 = rest.slice(0, index + 1);
      const k2 = k1.join("__");
      const isFn = k0 === fnName;
      const k3 = isFn
        ? `${version}/${k2}__${endpointMethod}`
        : `${version}/${k2}`;
      let k4 = k1.join(".children.");
      k4 = isFn ? `${k4}__${endpointMethod}` : k4;
      const label = isFn
        ? `${k0}${htmlCharacterCodes.doubleDash}${endpointMethod}`
        : k0;
      const item: IRawNavItem = {
        label,
        key: k3,
        withLink: isFn,
      };

      if (!get(linksMap, k4)) {
        set(linksMap, k4, item);
      }
    });
  }

  function navItemsWithRecordToList(
    parentLinks: IRawNavItem[],
    items: Record<string, RawNavItemWithRecord>
  ) {
    forEach(items, (i1) => {
      const item: IRawNavItem = {
        ...i1,
        children: undefined,
      };
      parentLinks.push(item);

      if (i1.children && !isObjectEmpty(i1.children)) {
        item.children = [];
        navItemsWithRecordToList(item.children, i1.children);
      }
    });
  }

  records.forEach(([endpointPath, endpointMethod]) => {
    setEntry(endpointPath, endpointMethod);
  });
  navItemsWithRecordToList(links, linksMap);

  return links;
}
