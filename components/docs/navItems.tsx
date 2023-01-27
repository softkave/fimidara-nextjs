import { ItemType } from "antd/lib/menu/hooks/useItems";
import { compact, flatten, isEmpty } from "lodash";
import Link from "next/link";
import toc from "./fimidara-rest-api-toc.json";

interface IRawNavItem {
  key: string;
  label: React.ReactNode;
  withLink?: boolean;
  children?: IRawNavItem[];
}

export const DOCS_BASE_PATH = "/docs";

function toAntDMenuItem(item: IRawNavItem, parentPath: string): ItemType {
  const itemPath = `${parentPath}/${item.key}`;
  const { withLink, ...itemRest } = item;
  return {
    ...itemRest,
    label: withLink ? (
      <Link href={itemPath}>
        <a href={itemPath}>{item.label}</a>
      </Link>
    ) : (
      item.label
    ),
    children: item.children
      ? toAntDMenuItemList(item.children, itemPath)
      : undefined,
  };
}

function toAntDMenuItemList(
  items: IRawNavItem[],
  parentPath: string
): ItemType[] {
  return compact(
    flatten(
      items.map((item, i) => {
        return [
          toAntDMenuItem(item, parentPath),
          i < items.length - 1 ? { type: "divider" } : undefined,
        ];
      })
    )
  );
}

const docsNavItems: IRawNavItem[] = [
  {
    key: "fimidara",
    label: "Fimidara",
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
  {
    key: "fimidara-rest-api",
    label: "Fimidara REST API",
    children: extractRestApiToc(toc),
  },
  // {
  //   key: "fimidara-js-sdk",
  //   label: "Fimidara JS SDK",
  //   children: [],
  // },
];

export const antdNavItems = toAntDMenuItemList(docsNavItems, DOCS_BASE_PATH);

type PathRecord<T = any> = Record<string, T>;
function extractRestApiToc(records: PathRecord) {
  const links: IRawNavItem[] = [];
  for (const k in records) {
    const children = records[k];
    if (isEmpty(children)) {
      // is leaf link
      links.push({
        withLink: true,
        label: k,
        key: k,
      });
    } else {
      links.push({
        label: k,
        key: k,
        children: extractRestApiToc(children),
      });
    }
  }

  return links;
}
