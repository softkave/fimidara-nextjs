import { Typography } from "antd";
import { first } from "lodash";
import Link from "next/link";
import React from "react";
import {
  fimidaraRestApiNavItems,
  getNavItemPath,
  restApiRawNavItems,
} from "./navItems";
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
    const itemPath = getNavItemPath(item, first(fimidaraRestApiNavItems)!);

    if (item.withLink) {
      return (
        <li key={item.key}>
          <Link href={itemPath}>{item.label}</Link>
        </li>
      );
    } else if (item.children) {
      return renderNavItemList(item.children, itemPath, item.label);
    }
  });

  return (
    <div key={parentPath}>
      <Typography.Title level={5} style={{ margin: "8px 0px" }}>
        {parentLabel}
      </Typography.Title>
      <ul key={parentPath}>{nodes}</ul>
    </div>
  );
}
