import ItemList from "@/components/utils/list/ItemList";
import { actionLabel, getWorkspaceActionList } from "@/lib/definitions/system";
import {
  AppActionType,
  PermissionItemAppliesTo,
  WorkspaceAppResourceType,
} from "fimidara";
import React from "react";
import PermissionAction from "./PermissionAction";
import { PermissionMapItemInfoPermitted } from "./types";

export interface PermissionActionListProps {
  disabled?: boolean;
  targetType?: WorkspaceAppResourceType;
  appliesTo?: PermissionItemAppliesTo;
  onChange: (
    action: AppActionType,
    permitted: PermissionMapItemInfoPermitted
  ) => void;
  getActionPermission(action: AppActionType): PermissionMapItemInfoPermitted;
}

const PermissionActionList: React.FC<PermissionActionListProps> = (props) => {
  const { disabled, targetType, appliesTo, onChange, getActionPermission } =
    props;

  const actions = getWorkspaceActionList(targetType);
  return (
    <ItemList
      items={actions}
      renderItem={(action) => {
        const permitted = getActionPermission(action);
        return (
          <PermissionAction
            label={actionLabel[action]}
            targetType={targetType}
            appliesTo={appliesTo}
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
