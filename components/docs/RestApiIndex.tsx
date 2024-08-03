import { toCompactArray } from "@/lib/utils/fns";
import Title from "antd/es/typography/Title";
import { first } from "lodash-es";
import Link from "next/link";
import React from "react";
import { IRawNavItem } from "../utils/page/side-nav/types.ts";
import {
  fimidaraRestApiNavItems,
  getNavItemPath,
  restApiRawNavItems,
} from "./navItems";

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
    const itemPath = getNavItemPath(
      item,
      toCompactArray(first(fimidaraRestApiNavItems))
    );

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
      <Title level={5} style={{ margin: "8px 0px" }}>
        {parentLabel}
      </Title>
      <ul key={parentPath}>{nodes}</ul>
    </div>
  );
}
