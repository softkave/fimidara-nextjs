import ItemList from "@/components/utils/list/ItemList";
import { actionLabel, getWorkspaceActionList } from "@/lib/definitions/system";
import { AppActionType, WorkspaceAppResourceType } from "fimidara";
import React from "react";
import PermissionAction from "./PermissionAction";
import { PermissionMapItemInfo } from "./types";

export interface PermissionActionListProps {
  disabled?: boolean;
  targetType?: WorkspaceAppResourceType;
  parentTargetType?: WorkspaceAppResourceType;
  onChange: (action: AppActionType, permitted: PermissionMapItemInfo) => void;
  getActionPermission(action: AppActionType): PermissionMapItemInfo;
}

const PermissionActionList: React.FC<PermissionActionListProps> = (props) => {
  const {
    disabled,
    targetType,
    parentTargetType,
    onChange,
    getActionPermission,
  } = props;

  const actions = getWorkspaceActionList(targetType);
  return (
    <ItemList
      bordered
      items={actions}
      renderItem={(action) => {
        const permitted = getActionPermission(action);
        return (
          <PermissionAction
            label={actionLabel[action]}
            targetType={targetType}
            parentTargetType={parentTargetType}
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
