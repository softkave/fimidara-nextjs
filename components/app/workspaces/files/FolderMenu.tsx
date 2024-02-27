import IconButton from "@/components/utils/buttons/IconButton";
import { errorMessageNotificatition } from "@/components/utils/errorHandling";
import { appClasses } from "@/components/utils/theme";
import { MenuInfo } from "@/components/utils/types";
import { insertAntdMenuDivider } from "@/components/utils/utils";
import { addRootnameToPath, folderConstants } from "@/lib/definitions/folder";
import { appWorkspacePaths } from "@/lib/definitions/system";
import { useWorkspaceFolderDeleteMutationHook } from "@/lib/hooks/mutationHooks";
import { Dropdown, MenuProps, Modal, message } from "antd";
import { Folder } from "fimidara";
import Link from "next/link";
import React from "react";
import { BsThreeDots } from "react-icons/bs";
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
  const permissionsHook = useTargetGrantPermissionModal({
    workspaceId: folder.workspaceId,
    targetId: folder.resourceId,
    targetType: "folder",
  });
  const deleteHook = useWorkspaceFolderDeleteMutationHook({
    onSuccess(data, params) {
      message.success("Folder scheduled for deletion");
      onScheduleDeleteSuccess();
    },
    onError(e, params) {
      errorMessageNotificatition(e, "Error deleting folder");
    },
  });

  const onSelectMenuItem = (info: MenuInfo) => {
    if (info.key === MenuKeys.DeleteItem) {
      Modal.confirm({
        title: "Are you sure you want to delete this folder?",
        okText: "Yes",
        cancelText: "No",
        okType: "primary",
        okButtonProps: { danger: true },
        onOk: async () => {
          await deleteHook.runAsync({
            body: {
              folderpath: addRootnameToPath(
                folder.namepath.join(folderConstants.nameSeparator),
                workspaceRootname
              ),
            },
          });
        },
        onCancel() {
          // do nothing
        },
      });
    } else if (info.key === MenuKeys.GrantPermission) {
      permissionsHook.toggle();
    }
  };

  const items: MenuProps["items"] = insertAntdMenuDivider([
    {
      key: MenuKeys.UpdateItem,
      label: (
        <Link
          href={appWorkspacePaths.folderForm(
            folder.workspaceId,
            folder.resourceId
          )}
        >
          Update Folder
        </Link>
      ),
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
      <Dropdown
        disabled={deleteHook.loading}
        trigger={["click"]}
        menu={{
          items,
          style: { minWidth: "150px" },
          onClick: onSelectMenuItem,
        }}
        placement="bottomRight"
      >
        <IconButton className={appClasses.iconBtn} icon={<BsThreeDots />} />
      </Dropdown>
      {permissionsHook.node}
    </React.Fragment>
  );
};

export default FolderMenu;
