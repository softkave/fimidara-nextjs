import { useDeleteModal } from "@/components/hooks/useDeleteModal.tsx";
import { usePermissionGroupForm } from "@/components/hooks/usePermissionGroupForm.tsx";
import { DropdownItems } from "@/components/ui/dropdown-items.tsx";
import IconButton from "@/components/utils/buttons/IconButton";
import { errorMessageNotificatition } from "@/components/utils/errorHandling";
import { insertAntdMenuDivider } from "@/components/utils/utils";
import { useToast } from "@/hooks/use-toast.ts";
import {
  useWorkspacePermissionGroupDeleteMutationHook,
  useWorkspacePermissionGroupUnassignMutationHook,
} from "@/lib/hooks/mutationHooks";
import { PermissionGroup } from "fimidara";
import { compact } from "lodash-es";
import { Ellipsis } from "lucide-react";
import React from "react";
import useTargetGrantPermissionModal from "../../../hooks/useTargetGrantPermissionModal";

export interface PermissionGroupMenuProps {
  permissionGroup: PermissionGroup;
  unassignParams?: { entityId: string };
  onCompleteDelete: () => any;
  onCompleteUnassignPermissionGroup: () => any;
}

enum MenuKeys {
  DeleteItem = "delete-item",
  UpdateItem = "update-item",
  UnassignPermissionGroup = "unassign-permission-group",
  GrantPermission = "grant-permission",
}

const PermissionGroupMenu: React.FC<PermissionGroupMenuProps> = (props) => {
  const {
    permissionGroup,
    unassignParams,
    onCompleteDelete,
    onCompleteUnassignPermissionGroup,
  } = props;

  const { toast } = useToast();

  const permissionsHook = useTargetGrantPermissionModal({
    workspaceId: permissionGroup.workspaceId,
    targetId: permissionGroup.resourceId,
    targetType: "permissionGroup",
  });

  const deleteHook = useWorkspacePermissionGroupDeleteMutationHook({
    onSuccess(data, params) {
      toast({ description: "Permission group scheduled for deletion" });
      onCompleteDelete();
    },
    onError(e, params) {
      errorMessageNotificatition(e, "Error deleting permission group", toast);
    },
  });

  const unassignPermissionGroupHook =
    useWorkspacePermissionGroupUnassignMutationHook({
      onSuccess(data, params) {
        toast({ description: "Permission group unassigned" });
        onCompleteUnassignPermissionGroup();
      },
      onError(e, params) {
        errorMessageNotificatition(
          e,
          "Error unassigning permission group",
          toast
        );
      },
    });

  const deleteModalHook = useDeleteModal({
    title: `Delete permission group - "${permissionGroup.name}"`,
    description: "Are you sure you want to delete this permission group?",
    onDelete: async () => {
      await deleteHook.runAsync({
        body: {
          permissionGroupId: permissionGroup.resourceId,
        },
      });
    },
  });

  const unassignModalHook = useDeleteModal({
    title: `Unassign permission group - "${permissionGroup.name}"`,
    description: "Are you sure you want to unassign this permission group?",
    onDelete: async () => {
      if (!unassignParams?.entityId) {
        return;
      }

      await unassignPermissionGroupHook.runAsync({
        body: {
          entityId: [unassignParams.entityId],
          permissionGroups: [permissionGroup.resourceId],
        },
      });
    },
  });

  const formHook = usePermissionGroupForm({
    workspaceId: permissionGroup.workspaceId,
  });

  const onSelectMenuItem = (key: string) => {
    if (key === MenuKeys.DeleteItem) {
      deleteModalHook.setShow(true);
    } else if (key === MenuKeys.GrantPermission) {
      permissionsHook.toggle();
    } else if (
      key === MenuKeys.UnassignPermissionGroup &&
      unassignParams?.entityId
    ) {
      unassignModalHook.setShow(true);
    } else if (key === MenuKeys.UpdateItem) {
      formHook.setFormOpen(permissionGroup);
    }
  };

  const items = insertAntdMenuDivider(
    compact([
      {
        key: MenuKeys.UpdateItem,
        label: "Update",
      },
      unassignParams && {
        key: MenuKeys.UnassignPermissionGroup,
        label: "Unassign",
      },
      {
        key: MenuKeys.GrantPermission,
        label: "Permissions",
      },
      {
        key: MenuKeys.DeleteItem,
        label: "Delete",
      },
    ])
  );

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
      {unassignModalHook.node}
      {formHook.node}
    </React.Fragment>
  );
};

export default PermissionGroupMenu;
