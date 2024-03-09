import { useToggle } from "ahooks";
import { FimidaraResourceType } from "fimidara";
import React from "react";
import TargetGrantPermissionForm from "../app/workspaces/permissions/TargetGrantPermissionsForm";

export interface UseTargetGrantPermissionModalProps {
  workspaceId: string;
  targetId: string;
  targetType: FimidaraResourceType;
}

export enum GrantPermissionKey {
  GrantPermission = "grant-permission",
}

export default function useTargetGrantPermissionModal(
  props: UseTargetGrantPermissionModalProps
) {
  const { workspaceId, targetId, targetType } = props;
  const [visible, toggleHook] = useToggle();

  const node = React.useMemo(() => {
    if (visible) {
      return (
        <TargetGrantPermissionForm
          workspaceId={workspaceId}
          targetId={targetId}
          targetType={targetType}
          onClose={toggleHook.toggle}
        />
      );
    } else {
      return null;
    }
  }, [visible, targetId, targetType, workspaceId, toggleHook.toggle]);

  return { node, toggle: toggleHook.toggle };
}
