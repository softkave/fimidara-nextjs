import { PermissionItemAppliesTo, WorkspaceAppResourceType } from "fimidara";
import React from "react";
import GrantPermissionFormContainer from "../app/workspaces/permissionItems/GrantPermissionFormContainer";

export interface IUseGrantPermissionProps {
  workspaceId: string;
  containerId: string;
  containerType: WorkspaceAppResourceType;
  targetId?: string;
  targetType: WorkspaceAppResourceType;
  appliesTo: PermissionItemAppliesTo;
}

export enum GrantPermissionKey {
  GrantPermission = "grant-permission",
}

export default function useGrantPermission(props: IUseGrantPermissionProps) {
  const {
    workspaceId,
    targetType,
    targetId,
    containerId,
    containerType,
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
          targetType={targetType}
          targetId={targetId}
          containerId={containerId}
          containerType={containerType}
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
    targetType,
    targetId,
    containerId,
    containerType,
    appliesTo,
  ]);

  return {
    grantPermissionFormNode,
    toggleVisibility,
  };
}
