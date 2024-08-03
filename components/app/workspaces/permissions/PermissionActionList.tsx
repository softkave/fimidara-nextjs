"use client";

import ItemList from "@/components/utils/list/ItemList";
import { kActionLabel } from "@/lib/definitions/system";
import { FimidaraPermissionAction } from "fimidara";
import React from "react";
import PermissionAction from "./PermissionAction";
import { PermissionMapItemInfo } from "./types";

export interface PermissionActionListProps {
  disabled?: boolean;
  items: PermissionMapItemInfo[];
  onChange: (
    action: FimidaraPermissionAction,
    permitted: PermissionMapItemInfo
  ) => void;
}

const PermissionActionList: React.FC<PermissionActionListProps> = (props) => {
  const { disabled, onChange, items } = props;

  return (
    <ItemList
      bordered
      items={items}
      renderItem={(p) => {
        return (
          <PermissionAction
            label={kActionLabel[p.action]}
            permitted={p}
            disabled={disabled}
            onChange={(change) => onChange(p.action, change)}
          />
        );
      }}
    />
  );
};

export default PermissionActionList;
