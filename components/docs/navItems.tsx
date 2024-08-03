import { ObjectValues } from "@/lib/api/utils";
import { first, forEach, get, last, set } from "lodash-es";
import { isObjectEmpty } from "../../lib/utils/fns";
import { IRawNavItem } from "../utils/page/side-nav/types.ts";
import { renderToAntDMenuItemList } from "../utils/page/side-nav/utils.tsx";
import { htmlCharacterCodes } from "../utils/utils";
import restApiTableOfContent from "./raw/toc/v1/table-of-content.json";

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

export type DocNavRootKeys = ObjectValues<typeof kDocNavRootKeysMap>;

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
    key: kDocNavRootKeysMap.restApi,
    label: "fimidara REST API",
    children: (
      [
        {
          withLink: true,
          label: "overview",
          key: kDocNavRootKeysMap.restApi + "__" + "overview",
          href: "overview",
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
          withLink: true,
          label: "overview",
          key: kDocNavRootKeysMap.jsSdk + "__" + "overview",
          href: "overview",
        },
      ] as IRawNavItem[]
    ).concat(jsSdkRawNavItems),
  },
];

export const fimidaraAntdNavItems = renderToAntDMenuItemList(
  fimidaraNavItems,
  /** parentItems */ [],
  getNavItemPath
);
export const fimidaraRestApiAntdNavItems = renderToAntDMenuItemList(
  fimidaraRestApiNavItems,
  /** parentItems */ [],
  getNavItemPath
);
export const fimidaraJsSdkAntdNavItems = renderToAntDMenuItemList(
  fimidaraJsSdkNavItems,
  /** parentItems */ [],
  getNavItemPath
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
        withLink: isFn,
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
