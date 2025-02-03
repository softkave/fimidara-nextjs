import { useDeleteModal } from "@/components/hooks/useDeleteModal.tsx";
import { useFolderForm } from "@/components/hooks/useFolderForm.tsx";
import { DropdownItems } from "@/components/ui/dropdown-items.tsx";
import IconButton from "@/components/utils/buttons/IconButton";
import { errorMessageNotificatition } from "@/components/utils/errorHandling";
import { insertMenuDivider } from "@/components/utils/utils";
import { useToast } from "@/hooks/use-toast.ts";
import { addRootnameToPath, folderConstants } from "@/lib/definitions/folder";
import { useWorkspaceFolderDeleteMutationHook } from "@/lib/hooks/mutationHooks";
import { Folder } from "fimidara";
import { Ellipsis } from "lucide-react";
import React from "react";
import useTargetGrantPermissionModal from "../../../hooks/useTargetGrantPermissionModal";

export interface FolderMenuProps {
  folder: Folder;
  workspaceRootname: string;
  onScheduleDeleteSuccess: () => void;
}

enum MenuKeys {
  DeleteItem = "delete-item",
  UpdateItem = "update-item",
  GrantPermission = "grant-permission",
}

const FolderMenu: React.FC<FolderMenuProps> = (props) => {
  const { folder, workspaceRootname, onScheduleDeleteSuccess } = props;
  const { toast } = useToast();
  const permissionsHook = useTargetGrantPermissionModal({
    workspaceId: folder.workspaceId,
    targetId: folder.resourceId,
    targetType: "folder",
  });
  const deleteHook = useWorkspaceFolderDeleteMutationHook({
    onSuccess(data, params) {
      toast({ description: "Folder scheduled for deletion" });
      onScheduleDeleteSuccess();
    },
    onError(error, params) {
      errorMessageNotificatition(error, "Error deleting folder", toast);
    },
  });

  const deleteModalHook = useDeleteModal({
    title: "Delete folder",
    description: `Are you sure you want to delete folder "${folder.name}"?`,
    onDelete: async () => {
      await deleteHook.runAsync({
        folderpath: addRootnameToPath(
          folder.namepath.join(folderConstants.nameSeparator),
          workspaceRootname
        ),
      });
    },
  });

  const formHook = useFolderForm({
    workspaceRootname,
    workspaceId: folder.workspaceId,
  });

  const onSelectMenuItem = (key: string) => {
    if (key === MenuKeys.DeleteItem) {
      deleteModalHook.setShow(true);
    } else if (key === MenuKeys.GrantPermission) {
      permissionsHook.toggle();
    } else if (key === MenuKeys.UpdateItem) {
      formHook.setFormOpen(folder);
    }
  };

  const items = insertMenuDivider([
    {
      key: MenuKeys.UpdateItem,
      label: "Update Folder",
    },
    {
      key: MenuKeys.GrantPermission,
      label: "Permissions",
    },
    {
      key: MenuKeys.DeleteItem,
      label: "Delete Folder",
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

export default FolderMenu;
