import { ItemType } from "antd/lib/menu/hooks/useItems";
import { compact, first, flatten, isString } from "lodash";
import Link from "next/link";
import restApiTableOfContent from "./raw/toc/v1/table-of-content.json";
import { IRawNavItem, RestApiDocsTableOfContentType } from "./types";

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
  restApiTableOfContent as RestApiDocsTableOfContentType
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
          label: "index page",
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
          label: "index page",
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

function extractRestApiFromRawTableOfContent(
  records: RestApiDocsTableOfContentType
) {
  const links: IRawNavItem[] = [];

  function getLinkFromPath(entry: string): IRawNavItem {
    const entrySplit = compact(entry.split("/"));
    const [version, groupName, fnName] = entrySplit;
    const key = version + "/" + groupName + "__" + fnName;
    return {
      key,
      withLink: true,
      label: fnName,
    };
  }

  records.forEach((entry) => {
    if (isString(entry)) {
      // is leaf link
      links.push(getLinkFromPath(entry));
    } else {
      const [groupName, fnNameList] = entry;
      links.push({
        label: groupName,
        key: groupName,
        children: fnNameList.map(getLinkFromPath),
      });
    }
  });

  return links;
}
