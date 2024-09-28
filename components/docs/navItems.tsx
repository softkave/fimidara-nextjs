import { kAppDocPaths } from "@/lib/definitions/paths/docs.ts";
import assert from "assert";
import { first, forEach, get, last, set } from "lodash-es";
import { ValueOf } from "type-fest";
import restApiTableOfContent from "../../api-raw/toc/v1/table-of-content.json";
import { isObjectEmpty } from "../../lib/utils/fns";
import { IRawNavItem } from "../utils/page/side-nav/types.ts";
import { renderToSideNavMenuItemList } from "../utils/page/side-nav/utils.tsx";
import { htmlCharacterCodes } from "../utils/utils";

export const DOCS_BASE_PATH = "/docs";
export const apiVersion = "v1";

export function getNavItemPath(item: IRawNavItem, parentItems: IRawNavItem[]) {
  const rootItem = first(parentItems);
  const includeVersion =
    rootItem?.key === kDocNavRootKeysMap.jsSdk ||
    rootItem?.key === kDocNavRootKeysMap.restApi;
  let prefixPath = "";

  if (rootItem) {
    if (includeVersion) prefixPath = `/${rootItem.key}/${apiVersion}`;
    else prefixPath = `/${rootItem.key}`;
  }

  return `${DOCS_BASE_PATH}${prefixPath}/${item.href || item.key}`;
}

export const kDocNavRootKeysMap = {
  fimidara: "fimidara",
  restApi: "fimidara-rest-api",
  jsSdk: "fimidara-js-sdk",
} as const;

export const kDocNavRootKeysList = Object.values(kDocNavRootKeysMap);

export type DocNavRootKeys = ValueOf<typeof kDocNavRootKeysMap>;

export const restApiRawNavItems = extractRestApiFromRawTableOfContent(
  restApiTableOfContent as any,
  kDocNavRootKeysMap.restApi
);
export const jsSdkRawNavItems = extractRestApiFromRawTableOfContent(
  restApiTableOfContent as any,
  kDocNavRootKeysMap.jsSdk
);

export const fimidaraNavItems: IRawNavItem[] = [
  {
    key: kDocNavRootKeysMap.fimidara,
    label: "fimidara",
    children: [
      {
        label: "Introduction",
        key: "introduction",
        href: kAppDocPaths.fimidaraDoc("introduction"),
      },
      {
        label: "Workspace",
        key: "workspace",
        href: kAppDocPaths.fimidaraDoc("workspace"),
      },
    ],
  },
];
export const fimidaraRestApiNavItems: IRawNavItem[] = [
  {
    key: kDocNavRootKeysMap.restApi,
    label: "fimidara REST API",
    children: (
      [
        {
          label: "overview",
          key: kDocNavRootKeysMap.restApi + "__" + "overview",
          href: kAppDocPaths.fimidaraRestApiDoc("overview"),
        },
      ] as IRawNavItem[]
    ).concat(restApiRawNavItems),
  },
];
export const fimidaraJsSdkNavItems: IRawNavItem[] = [
  {
    key: kDocNavRootKeysMap.jsSdk,
    label: "fimidara JS SDK",
    children: (
      [
        {
          label: "overview",
          key: kDocNavRootKeysMap.jsSdk + "__" + "overview",
          href: kAppDocPaths.fimidaraJsSdkDoc("overview"),
        },
      ] as IRawNavItem[]
    ).concat(jsSdkRawNavItems),
  },
];

export const fimidaraAntdNavItems =
  renderToSideNavMenuItemList(fimidaraNavItems);
export const fimidaraRestApiAntdNavItems = renderToSideNavMenuItemList(
  fimidaraRestApiNavItems
);
export const fimidaraJsSdkAntdNavItems = renderToSideNavMenuItemList(
  fimidaraJsSdkNavItems
);

function extractRestApiFromRawTableOfContent(
  records: Array<[/** path */ string, /** http method */ string]>,
  rootKey: DocNavRootKeys
) {
  interface NavItemIntermediateRep {
    key: string;
    label: React.ReactNode;
    withLink?: boolean;
    children?: Record<string, NavItemIntermediateRep>;
  }

  const links: IRawNavItem[] = [];
  const linksMap: Record<string, NavItemIntermediateRep> = {};
  const pFn =
    rootKey === kDocNavRootKeysMap.restApi
      ? kAppDocPaths.fimidaraRestApiDoc
      : rootKey === kDocNavRootKeysMap.jsSdk
      ? kAppDocPaths.fimidaraJsSdkDoc
      : undefined;
  assert(pFn);

  function setEntry(endpointPath: string, httpMethod: string) {
    const [unused, apiVersion, ...restPath] = endpointPath
      .split("/")
      // filter out sections starting with ":". ":" represents path variable
      .filter((p) => !p.startsWith(":"));
    const fnName = last(restPath);

    restPath.forEach((nextKey, index) => {
      const keyList = restPath.slice(0, index + 1);
      const keysJoined = keyList.join("__");
      const isFn = nextKey === fnName;
      const itemKey =
        rootKey + "__" + (isFn ? `${keysJoined}__${httpMethod}` : keysJoined);
      let fullKeyPath = keyList.join(".children.");
      fullKeyPath = isFn ? `${fullKeyPath}__${httpMethod}` : fullKeyPath;
      const label =
        isFn && rootKey === kDocNavRootKeysMap.restApi
          ? `${nextKey}${htmlCharacterCodes.doubleDash}${httpMethod}`
          : nextKey;
      const item: IRawNavItem = {
        label,
        key: itemKey,
        href: pFn?.(itemKey),
      };

      if (!get(linksMap, fullKeyPath)) {
        set(linksMap, fullKeyPath, item);
      }
    });
  }

  function toList(
    parentItems: IRawNavItem[],
    items: Record<string, NavItemIntermediateRep>
  ) {
    forEach(items, (nextItem) => {
      const item: IRawNavItem = { ...nextItem, children: undefined };
      parentItems.push(item);

      if (nextItem.children && !isObjectEmpty(nextItem.children)) {
        item.children = [];
        toList(item.children, nextItem.children);
      }
    });
  }

  if (rootKey === kDocNavRootKeysMap.jsSdk) {
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

  records.forEach(([endpointPath, httpMethod]) => {
    setEntry(endpointPath, httpMethod);
  });

  toList(links, linksMap);
  return links;
}
