import { toCompactArray } from "@/lib/utils/fns";
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

    return (
      <li key={item.key}>
        {item.href && !item.children && (
          <Link href={item.href} className="underline decoration-sky-500">
            {item.label}
          </Link>
        )}
        {item.children &&
          renderNavItemList(item.children, itemPath, item.label)}
      </li>
    );
  });

  return (
    <div key={parentPath}>
      <h5 className="my-2">{parentLabel}</h5>
      <ul key={parentPath}>{nodes}</ul>
    </div>
  );
}
