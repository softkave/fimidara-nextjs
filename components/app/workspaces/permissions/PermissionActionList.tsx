import ItemList from "@/components/utils/list/ItemList";
import { actionLabel } from "@/lib/definitions/system";
import { AppActionType } from "fimidara";
import React from "react";
import PermissionAction from "./PermissionAction";
import { PermissionMapItemInfo } from "./types";

export interface PermissionActionListProps {
  actions: AppActionType[];
  disabled?: boolean;
  onChange: (action: AppActionType, permitted: PermissionMapItemInfo) => void;
  getActionPermission(action: AppActionType): PermissionMapItemInfo;
}

const PermissionActionList: React.FC<PermissionActionListProps> = (props) => {
  const { actions, disabled, onChange, getActionPermission } = props;

  return (
    <ItemList
      bordered
      items={actions}
      renderItem={(action) => {
        const permitted = getActionPermission(action);
        return (
          <PermissionAction
            label={actionLabel[action]}
            permitted={permitted}
            disabled={disabled}
            onChange={(inputPermitted) => onChange(action, inputPermitted)}
          />
        );
      }}
    />
  );
};

export default PermissionActionList;
