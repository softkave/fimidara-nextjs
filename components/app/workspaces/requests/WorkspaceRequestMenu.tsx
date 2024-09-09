import { useCollaborationRequestForm } from "@/components/hooks/useCollaborationRequestForm.tsx";
import { useDeleteModal } from "@/components/hooks/useDeleteModal.tsx";
import { DropdownItems } from "@/components/ui/dropdown-items.tsx";
import IconButton from "@/components/utils/buttons/IconButton";
import { errorMessageNotificatition } from "@/components/utils/errorHandling";
import { insertAntdMenuDivider } from "@/components/utils/utils";
import { useToast } from "@/hooks/use-toast.ts";
import { useWorkspaceCollaborationRequestDeleteMutationHook } from "@/lib/hooks/mutationHooks";
import { CollaborationRequestForWorkspace } from "fimidara";
import { Ellipsis } from "lucide-react";
import React from "react";
import useTargetGrantPermissionModal from "../../../hooks/useTargetGrantPermissionModal";

export interface IWorkspaceRequestMenuProps {
  request: CollaborationRequestForWorkspace;
  onCompleteDeleteRequest: () => void;
}

enum MenuKeys {
  DeleteItem = "delete-item",
  UpdateItem = "update-item",
  GrantPermission = "grant-permission",
}

const WorkspaceRequestMenu: React.FC<IWorkspaceRequestMenuProps> = (props) => {
  const { request, onCompleteDeleteRequest } = props;
  const { toast } = useToast();
  const permissionsHook = useTargetGrantPermissionModal({
    workspaceId: request.workspaceId,
    targetId: request.resourceId,
    targetType: "collaborationRequest",
  });
  const deleteHook = useWorkspaceCollaborationRequestDeleteMutationHook({
    onSuccess(data, params) {
      toast({ description: "Collaboration request scheduled for deletion" });
      onCompleteDeleteRequest();
    },
    onError(e, params) {
      errorMessageNotificatition(
        e,
        "Error deleting collaboration request",
        toast
      );
    },
  });

  const deleteModalHook = useDeleteModal({
    title: `Delete collaboration request to - "${request.recipientEmail}"`,
    description: "Are you sure you want to delete this collaboration request?",
    onDelete: async () => {
      await deleteHook.runAsync({
        body: { requestId: request.resourceId },
      });
    },
  });

  const formHook = useCollaborationRequestForm({
    workspaceId: request.workspaceId,
  });

  const onSelectMenuItem = (key: string) => {
    if (key === MenuKeys.DeleteItem) {
      deleteModalHook.setShow(true);
    } else if (key === MenuKeys.GrantPermission) {
      permissionsHook.toggle();
    } else if (key === MenuKeys.UpdateItem) {
      formHook.setFormOpen(request);
    }
  };

  const isPending = request.status === "pending";
  const items = insertAntdMenuDivider([
    {
      // TODO: only show if user has permission
      key: MenuKeys.UpdateItem,
      label: "Update Request",
      disabled: !isPending,
    },
    {
      key: MenuKeys.GrantPermission,
      label: "Permissions",
    },
    {
      key: MenuKeys.DeleteItem,
      label: "Delete Request",
      disabled: !isPending,
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
      {formHook.node}
    </React.Fragment>
  );
};

export default WorkspaceRequestMenu;
