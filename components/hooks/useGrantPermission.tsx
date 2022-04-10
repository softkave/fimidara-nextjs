import React from "react";
import { PermissionItemAppliesTo } from "../../lib/definitions/permissionItem";
import { AppResourceType } from "../../lib/definitions/system";
import GrantPermissionFormContainer from "../app/orgs/permissionItems/GrantPermissionFormContainer";

export interface IUseGrantPermissionProps {
  orgId: string;
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
  const [visible, setVisibility] = React.useState(false);
  const toggleVisibility = React.useCallback(() => {
    setVisibility(!visible);
  }, [visible]);

  const grantPermissionFormNode = React.useMemo(() => {
    if (visible) {
      return (
        <GrantPermissionFormContainer {...props} onCancel={toggleVisibility} />
      );
    } else {
      return null;
    }
  }, [visible, toggleVisibility]);

  return {
    grantPermissionFormNode,
    toggleVisibility,
  };
}
