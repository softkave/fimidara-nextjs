import { useToggle } from "ahooks";
import { WorkspaceAppResourceType } from "fimidara";
import React from "react";
import TargetGrantPermissionForm from "../app/workspaces/permissions/TargetGrantPermissionsForm";

export interface UseTargetGrantPermissionModalProps {
  workspaceId: string;
  targetId: string;
  forTargetTypeOnly?: WorkspaceAppResourceType | WorkspaceAppResourceType[];
}

export enum GrantPermissionKey {
  GrantPermission = "grant-permission",
}

export default function useTargetGrantPermissionModal(
  props: UseTargetGrantPermissionModalProps
) {
  const { workspaceId, targetId, forTargetTypeOnly } = props;
  const [visible, toggleHook] = useToggle();

  const node = React.useMemo(() => {
    if (visible) {
      return (
        <TargetGrantPermissionForm
          workspaceId={workspaceId}
          targetId={targetId}
          forTargetTypeOnly={forTargetTypeOnly}
          onClose={toggleHook.toggle}
        />
      );
    } else {
      return null;
    }
  }, [visible, targetId, forTargetTypeOnly, workspaceId, toggleHook.toggle]);

  return { node, toggle: toggleHook.toggle };
}
