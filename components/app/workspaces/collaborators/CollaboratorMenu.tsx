import { useDeleteModal } from "@/components/hooks/useDeleteModal.tsx";
import { DropdownItems } from "@/components/ui/dropdown-items.tsx";
import IconButton from "@/components/utils/buttons/IconButton";
import { errorMessageNotificatition } from "@/components/utils/errorHandling";
import { insertAntdMenuDivider } from "@/components/utils/utils";
import { useToast } from "@/hooks/use-toast.ts";
import { useWorkspaceCollaboratorDeleteMutationHook } from "@/lib/hooks/mutationHooks";
import { Collaborator } from "fimidara";
import { Ellipsis } from "lucide-react";
import React from "react";
import useTargetGrantPermissionModal from "../../../hooks/useTargetGrantPermissionModal";

export interface CollaboratorMenuProps {
  workspaceId: string;
  collaborator: Collaborator;
  onCompleteRemove: () => any;
}

enum MenuKeys {
  DeleteItem = "delete-item",
  GrantPermission = "grant-permission",
}

const CollaboratorMenu: React.FC<CollaboratorMenuProps> = (props) => {
  const { workspaceId, collaborator, onCompleteRemove } = props;
  const { toast } = useToast();
  const permissionsHook = useTargetGrantPermissionModal({
    workspaceId,
    targetId: collaborator.resourceId,
    targetType: "user",
  });
  const deleteHook = useWorkspaceCollaboratorDeleteMutationHook({
    onSuccess(data, params) {
      toast({ description: "Collaborator removed" });
      onCompleteRemove();
    },
    onError(error, params) {
      errorMessageNotificatition(error, "Error removing collaborator", toast);
    },
  });

  const deleteModalHook = useDeleteModal({
    title: `Remove collaborator - "${collaborator.firstName}"`,
    description: "Are you sure you want to remove this collaborator?",
    onDelete: async () => {
      await deleteHook.runAsync({
        body: { workspaceId, collaboratorId: collaborator.resourceId },
      });
    },
  });

  const onSelectMenuItem = (key: string) => {
    if (key === MenuKeys.DeleteItem) {
      deleteModalHook.setShow(true);
    } else if (key === MenuKeys.GrantPermission) {
      permissionsHook.toggle();
    }
  };

  const items = insertAntdMenuDivider([
    {
      key: MenuKeys.GrantPermission,
      label: "Permissions",
    },
    {
      key: MenuKeys.DeleteItem,
      label: "Remove Collaborator",
    },
  ]);

  return (
    <React.Fragment>
      <DropdownItems
        disabled={deleteHook.loading}
        items={items}
        onSelect={onSelectMenuItem}
      >
        <IconButton icon={<Ellipsis className="w-4 h-4" />} />
      </DropdownItems>
      {permissionsHook.node}
      {deleteModalHook.node}
    </React.Fragment>
  );
};

export default CollaboratorMenu;
