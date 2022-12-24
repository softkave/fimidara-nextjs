import Link from "next/link";

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
    children: [
      {
        withLink: true,
        label: "Workspaces",
        key: "workspaces",
      },
      {
        withLink: true,
        label: "Collaboration Requests",
        key: "collaboration-requests",
      },
      {
        withLink: true,
        label: "Collaborators",
        key: "collaborators",
      },
      {
        withLink: true,
        label: "Folders",
        key: "folders",
      },
      {
        withLink: true,
        label: "Files",
        key: "files",
      },
      {
        withLink: true,
        label: "Permission Groups",
        key: "permission-groups",
      },
      {
        withLink: true,
        label: "Permission Items",
        key: "permission-items",
      },
      {
        withLink: true,
        label: "Client Assigned Tokens",
        key: "client-assigned-tokens",
      },
      {
        withLink: true,
        label: "Program Access Tokens",
        key: "program-access-tokens",
      },
      {
        withLink: true,
        label: "Usage Records",
        key: "usage-records",
      },
    ],
  },
  {
    key: "fimidara-js-sdk",
    label: "Fimidara JS SDK",
    children: [],
  },
].map((item) => toAntDMenuItem(item, DOCS_BASE_PATH));
