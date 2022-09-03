import Link from "next/link";

interface IRawNavItem {
  key: string;
  label: React.ReactNode;
  href?: string;
  children?: IRawNavItem[];
}

function toAntDMenuItem(item: IRawNavItem): IRawNavItem {
  return {
    ...item,
    label: item.href ? (
      <Link href={item.href}>
        <a href={item.href}>{item.label}</a>
      </Link>
    ) : (
      item.label
    ),
    children: item.children ? item.children.map(toAntDMenuItem) : undefined,
  };
}

export const docsNavItems: IRawNavItem[] = [
  {
    key: "fimidara",
    label: "fimidara",
    children: [
      {
        href: "/docs/fimidara/introduction",
        label: "Introduction",
        key: "introduction",
      },
      {
        href: "/docs/fimidara/workspace",
        label: "Workspace",
        key: "workspace",
      },
      {
        href: "/docs/fimidara/permissions-and-access-control",
        label: "Permissions and Access Control",
        key: "permissions",
      },
    ],
  },
].map(toAntDMenuItem);
