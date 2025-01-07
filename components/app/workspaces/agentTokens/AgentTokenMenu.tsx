import { useAgentTokenForm } from "@/components/hooks/useAgentTokenForm.tsx";
import { useDeleteModal } from "@/components/hooks/useDeleteModal.tsx";
import { DropdownItems } from "@/components/ui/dropdown-items.tsx";
import IconButton from "@/components/utils/buttons/IconButton";
import { errorMessageNotificatition } from "@/components/utils/errorHandling";
import { insertMenuDivider } from "@/components/utils/utils";
import { useToast } from "@/hooks/use-toast.ts";
import { useWorkspaceAgentTokenDeleteMutationHook } from "@/lib/hooks/mutationHooks";
import { AgentToken } from "fimidara";
import { Ellipsis } from "lucide-react";
import React from "react";
import useTargetGrantPermissionModal from "../../../hooks/useTargetGrantPermissionModal";

export interface AgentTokenMenuProps {
  token: AgentToken;
  onCompleteDelete: () => any;
}

enum MenuKeys {
  DeleteToken = "delete-token",
  UpdatePermissionGroups = "update-permissionGroups",
  GrantPermission = "grant-permission",
}

const AgentTokenMenu: React.FC<AgentTokenMenuProps> = (props) => {
  const { token, onCompleteDelete } = props;
  const { toast } = useToast();
  const permissionsHook = useTargetGrantPermissionModal({
    workspaceId: token.workspaceId,
    targetId: token.resourceId,
    targetType: "agentToken",
  });
  const deleteHook = useWorkspaceAgentTokenDeleteMutationHook({
    onSuccess(data, params) {
      toast({ description: "Agent token scheduled for deletion" });
      onCompleteDelete();
    },
    onError(error, params) {
      errorMessageNotificatition(error, "Error deleting token", toast);
    },
  });

  const deleteModalHook = useDeleteModal({
    title: `Delete agent token - "${token.name}"`,
    description: "Are you sure you want to delete this agent token?",
    onDelete: async () => {
      await deleteHook.runAsync({
        tokenId: token.resourceId,
      });
    },
  });

  const formHook = useAgentTokenForm({ workspaceId: token.workspaceId });

  const onSelectMenuItem = (key: string) => {
    if (key === MenuKeys.DeleteToken) {
      deleteModalHook.setShow(true);
    } else if (key === MenuKeys.GrantPermission) {
      permissionsHook.toggle();
    } else if (key === MenuKeys.UpdatePermissionGroups) {
      formHook.setFormOpen(token);
    }
  };

  const items = insertMenuDivider([
    {
      // TODO: only show if user has permission
      key: MenuKeys.UpdatePermissionGroups,
      label: "Update Agent Token",
    },
    {
      key: MenuKeys.GrantPermission,
      label: "Permissions",
    },
    {
      key: MenuKeys.DeleteToken,
      label: "Delete Token",
    },
  ]);

  return (
    <React.Fragment>
      {permissionsHook.node}
      {deleteModalHook.node}
      {formHook.node}
      <DropdownItems
        disabled={deleteHook.loading}
        items={items}
        onSelect={onSelectMenuItem}
      >
        <IconButton icon={<Ellipsis className="w-4 h-4" />} />
      </DropdownItems>
    </React.Fragment>
  );
};

export default AgentTokenMenu;
