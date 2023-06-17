import { ObjectValues } from "@/lib/api/utils";
import { ItemType } from "antd/lib/menu/hooks/useItems";
import { compact, first, flatten, forEach, get, last, set } from "lodash";
import Link from "next/link";
import { isObjectEmpty } from "../../lib/utils/fns";
import { htmlCharacterCodes } from "../utils/utils";
import restApiTableOfContent from "./raw/toc/v1/table-of-content.json";
import { IRawNavItem } from "./types";

export const DOCS_BASE_PATH = "/docs";
export const apiVersion = "v1";

export function getNavItemPath(item: IRawNavItem, parentItems: IRawNavItem[]) {
  const rootItem = first(parentItems);
  const includeVersion =
    rootItem?.key === DocNavRootKeysMap.jsSdk ||
    rootItem?.key === DocNavRootKeysMap.restApi;
  let prefixPath = "";

  if (rootItem) {
    if (includeVersion) prefixPath = `/${rootItem.key}/${apiVersion}`;
    else prefixPath = `/${rootItem.key}`;
  }

  return `${DOCS_BASE_PATH}${prefixPath}/${item.key}`;
}

export function renderRawNavItemLink(
  item: IRawNavItem,
  parentItems: IRawNavItem[]
) {
  const itemPath = getNavItemPath(item, parentItems);
  return <Link href={itemPath}>{item.label}</Link>;
}

export function getAntDMenuItemKey(itemKey: string, rootItemKey?: string) {
  if (rootItemKey) return `${rootItemKey}_${itemKey}`;
  else return itemKey;
}

function renderToAntDMenuItem(
  item: IRawNavItem,
  parentItems: IRawNavItem[]
): ItemType {
  const { withLink, ...itemRest } = item;
  const rootItem = first(parentItems);
  const key = getAntDMenuItemKey(item.key, rootItem?.key);
  return {
    ...itemRest,
    key,
    label: withLink ? renderRawNavItemLink(item, parentItems) : item.label,
    children: item.children
      ? renderToAntDMenuItemList(item.children, parentItems.concat(item))
      : undefined,
  };
}

function renderToAntDMenuItemList(
  items: IRawNavItem[],
  parentItems: IRawNavItem[]
): ItemType[] {
  return compact(
    flatten(
      items.map((item, i) => {
        return [
          renderToAntDMenuItem(item, parentItems),
          i < items.length - 1 ? { type: "divider" } : undefined,
        ];
      })
    )
  );
}

export const DocNavRootKeysMap = {
  fimidara: "fimidara",
  restApi: "fimidara-rest-api",
  jsSdk: "fimidara-js-sdk",
} as const;
export type DocNavRootKeys = ObjectValues<typeof DocNavRootKeysMap>;

export const restApiRawNavItems = extractRestApiFromRawTableOfContent(
  restApiTableOfContent as any,
  DocNavRootKeysMap.restApi
);
export const jsSdkRawNavItems = extractRestApiFromRawTableOfContent(
  restApiTableOfContent as any,
  DocNavRootKeysMap.jsSdk
);

export const fimidaraNavItems: IRawNavItem[] = [
  {
    key: DocNavRootKeysMap.fimidara,
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
    key: DocNavRootKeysMap.restApi,
    label: "fimidara REST API",
    children: (
      [
        {
          withLink: true,
          label: "overview",
          key: "overview",
        },
      ] as IRawNavItem[]
    ).concat(restApiRawNavItems),
  },
];
export const fimidaraJsSdkNavItems: IRawNavItem[] = [
  {
    key: DocNavRootKeysMap.jsSdk,
    label: "fimidara JS SDK",
    children: (
      [
        {
          withLink: true,
          label: "overview",
          key: "overview",
        },
      ] as IRawNavItem[]
    ).concat(jsSdkRawNavItems),
  },
];

export const fimidaraAntdNavItems = renderToAntDMenuItemList(
  fimidaraNavItems,
  []
);
export const fimidaraRestApiAntdNavItems = renderToAntDMenuItemList(
  fimidaraRestApiNavItems,
  []
);
export const fimidaraJsSdkAntdNavItems = renderToAntDMenuItemList(
  fimidaraJsSdkNavItems,
  []
);

function extractRestApiFromRawTableOfContent(
  records: Array<[string, string]>,
  use: DocNavRootKeys
) {
  interface RawNavItemWithRecord {
    key: string;
    label: React.ReactNode;
    withLink?: boolean;
    children?: Record<string, RawNavItemWithRecord>;
  }

  const links: IRawNavItem[] = [];
  const linksMap: Record<string, RawNavItemWithRecord> = {};

  function setEntry(endpointPath: string, endpointMethod: string) {
    const [unused, version, ...restPath] = endpointPath.split("/");
    const fnName = last(restPath);

    restPath.forEach((nextKey, index) => {
      const keyList = restPath.slice(0, index + 1);
      const keysJoined = keyList.join("__");
      const isFn = nextKey === fnName;
      const itemKey = isFn ? `${keysJoined}__${endpointMethod}` : keysJoined;
      let fullKeyPath = keyList.join(".children.");
      fullKeyPath = isFn ? `${fullKeyPath}__${endpointMethod}` : fullKeyPath;
      const label =
        isFn && use === DocNavRootKeysMap.restApi
          ? `${nextKey}${htmlCharacterCodes.doubleDash}${endpointMethod}`
          : nextKey;
      const item: IRawNavItem = {
        label,
        key: itemKey,
        withLink: isFn,
      };

      if (!get(linksMap, fullKeyPath)) {
        set(linksMap, fullKeyPath, item);
      }
    });
  }

  function navItemsWithRecordToList(
    parentLinks: IRawNavItem[],
    items: Record<string, RawNavItemWithRecord>
  ) {
    forEach(items, (nextItem) => {
      const item: IRawNavItem = { ...nextItem, children: undefined };
      parentLinks.push(item);

      if (nextItem.children && !isObjectEmpty(nextItem.children)) {
        item.children = [];
        navItemsWithRecordToList(item.children, nextItem.children);
      }
    });
  }

  if (use === DocNavRootKeysMap.jsSdk) {
    const localMap: Record<string, [string, string]> = {};
    records = records.filter(([endpointPath, endpointMethod]) => {
      const entry = localMap[endpointPath];

      if (entry) {
        if (entry[1] === "post") return false;
      }

      localMap[endpointPath] = [endpointPath, endpointMethod];
      return true;
    });
  }

  records.forEach(([endpointPath, endpointMethod]) => {
    setEntry(endpointPath, endpointMethod);
  });
  navItemsWithRecordToList(links, linksMap);

  return links;
}
