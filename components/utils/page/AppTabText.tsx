import { Badge } from "@/components/ui/badge.tsx";
import { isString } from "lodash-es";
import React from "react";

export interface IAppTabTextProps {
  node: React.ReactNode;
  badgeCount?: number;
}

const AppTabText: React.FC<IAppTabTextProps> = (props) => {
  const { node, badgeCount } = props;
  return (
    <div className="space-x-2">
      {isString(node) ? <span>{node}</span> : node}
      {badgeCount ? <Badge>{badgeCount}</Badge> : null}
    </div>
  );
};

export default React.memo(AppTabText);
