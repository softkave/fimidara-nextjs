import { DropdownItems } from "@/components/ui/dropdown-items.tsx";
import { ToastAction } from "@/components/ui/toast.tsx";
import IconButton from "@/components/utils/buttons/IconButton";
import { appClasses } from "@/components/utils/theme";
import { insertAntdMenuDivider } from "@/components/utils/utils";
import { useToast } from "@/hooks/use-toast.ts";
import { kAppWorkspacePaths } from "@/lib/definitions/system";
import { Workspace } from "fimidara";
import { compact, noop } from "lodash-es";
import { Ellipsis } from "lucide-react";
import Link from "next/link";
import React from "react";
import useTargetGrantPermissionModal from "../../hooks/useTargetGrantPermissionModal";

export interface WorkspaceMenuProps {
  workspace: Workspace;
  includeDeleteMenuOption?: boolean;
  onCompleteDelete: () => any;
}

enum MenuKeys {
  UpdateWorkspace = "update",
  DeleteWorkspace = "delete",
  GrantPermission = "grant-permission",
}

const WorkspaceMenu: React.FC<WorkspaceMenuProps> = (props) => {
  const { workspace, includeDeleteMenuOption, onCompleteDelete } = props;
  const { toast } = useToast();
  const permissionsHook = useTargetGrantPermissionModal({
    workspaceId: workspace.workspaceId,
    targetId: workspace.resourceId,
    targetType: "workspace",
  });

  const onSelectMenuItem = (key: string) => {
    if (key === MenuKeys.DeleteWorkspace) {
      toast({
        title: "Are you sure you want to delete this workspace?",
        action: (
          <ToastAction altText="Yes" onClick={noop}>
            Yes
          </ToastAction>
        ),
      });
    } else if (key === MenuKeys.GrantPermission) {
      permissionsHook.toggle();
    }
  };

  const items = insertAntdMenuDivider(
    compact([
      {
        // TODO: only show if user has permission
        key: MenuKeys.UpdateWorkspace,
        label: (
          <Link
            href={kAppWorkspacePaths.updateWorkspaceForm(workspace.workspaceId)}
          >
            Update Workspace
          </Link>
        ),
      },
      {
        key: MenuKeys.GrantPermission,
        label: "Permissions",
      },
    ])
  );

  return (
    <React.Fragment>
      <DropdownItems items={items} onSelect={onSelectMenuItem}>
        <IconButton
          className={appClasses.iconBtn}
          icon={<Ellipsis className="w-4 h-4" />}
        />
      </DropdownItems>{" "}
      {permissionsHook.node}
    </React.Fragment>
  );
};

export default WorkspaceMenu;
