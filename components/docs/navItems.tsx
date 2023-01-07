import { isEmpty } from "lodash";
import Link from "next/link";
import toc from "./fimidara-rest-api-toc.json";

interface IRawNavItem {
  key: string;
  label: React.ReactNode;
  withLink?: boolean;
  children?: IRawNavItem[];
}

export const DOCS_BASE_PATH = "/docs";

function toAntDMenuItem(item: IRawNavItem, parentPath: string): IRawNavItem {
  const itemPath = `${parentPath}/${item.key}`;
  return {
    ...item,
    label: item.withLink ? (
      <Link href={itemPath}>
        <a href={itemPath}>{item.label}</a>
      </Link>
    ) : (
      item.label
    ),
    children: item.children
      ? item.children.map((item) => toAntDMenuItem(item, itemPath))
      : undefined,
  };
}

export const docsNavItems: IRawNavItem[] = [
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
].map((item) => toAntDMenuItem(item, DOCS_BASE_PATH));

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
