import React from "react";
import { PermissionItemAppliesTo } from "../../lib/definitions/permissionItem";
import { AppResourceType } from "../../lib/definitions/system";
import GrantPermissionFormContainer from "../app/workspaces/permissionItems/GrantPermissionFormContainer";

export interface IUseGrantPermissionProps {
  workspaceId: string;
  permissionOwnerId: string;
  permissionOwnerType: AppResourceType;
  itemResourceId?: string;
  itemResourceType: AppResourceType;
  appliesTo: PermissionItemAppliesTo;
}

export enum GrantPermissionKey {
  GrantPermission = "grant-permission",
}

export default function useGrantPermission(props: IUseGrantPermissionProps) {
  const {
    workspaceId,
    itemResourceType,
    itemResourceId,
    permissionOwnerId,
    permissionOwnerType,
    appliesTo,
  } = props;
  const [visible, setVisibility] = React.useState(false);
  const toggleVisibility = React.useCallback(() => {
    setVisibility(!visible);
  }, [visible]);

  const grantPermissionFormNode = React.useMemo(() => {
    if (visible) {
      return (
        <GrantPermissionFormContainer
          workspaceId={workspaceId}
          itemResourceType={itemResourceType}
          itemResourceId={itemResourceId}
          permissionOwnerId={permissionOwnerId}
          permissionOwnerType={permissionOwnerType}
          appliesTo={appliesTo}
          onCancel={toggleVisibility}
        />
      );
    } else {
      return null;
    }
  }, [
    visible,
    toggleVisibility,
    workspaceId,
    itemResourceType,
    itemResourceId,
    permissionOwnerId,
    permissionOwnerType,
    appliesTo,
  ]);

  return {
    grantPermissionFormNode,
    toggleVisibility,
  };
}
