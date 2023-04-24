import { Typography } from "antd";
import Link from "next/link";
import React from "react";
import { getNavItemPath, restApiRawNavItems } from "./navItems";
import { IRawNavItem } from "./types";

export interface RestApiIndexProps {}

const RestApiIndex: React.FC<RestApiIndexProps> = (props) => {
  return (
    <React.Fragment>
      {renderNavItemList(restApiRawNavItems, "", "Fimidara REST API")}
    </React.Fragment>
  );
};

export default RestApiIndex;

function renderNavItemList(
  items: IRawNavItem[],
  parentPath: string,
  parentLabel: React.ReactNode
) {
  const nodes = items.map((item) => {
    const itemPath = getNavItemPath(item);
    if (item.withLink) {
      return (
        <li key={item.key}>
          <Link href={itemPath}>
            <Typography.Link>{item.label}</Typography.Link>
          </Link>
        </li>
      );
    } else if (item.children) {
      return renderNavItemList(item.children, itemPath, item.label);
    }
  });

  return (
    <div>
      <Typography.Title level={4}>{parentLabel}</Typography.Title>
      <ul key={parentPath}>{nodes}</ul>
    </div>
  );
}
