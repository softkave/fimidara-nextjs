import { PermissionItemAppliesTo, WorkspaceAppResourceType } from "fimidara";
import React from "react";

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

  const grantPermissionFormNode = null;

  return {
    grantPermissionFormNode,
    toggleVisibility,
  };
}
