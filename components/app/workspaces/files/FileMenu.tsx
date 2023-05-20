import { addRootnameToPath, folderConstants } from "@/lib/definitions/folder";
import { appWorkspacePaths } from "@/lib/definitions/system";
import { useWorkspaceFileDeleteMutationHook } from "@/lib/hooks/mutationHooks";
import { Dropdown, MenuProps, Modal, message } from "antd";
import { File } from "fimidara";
import Link from "next/link";
import React from "react";
import { BsThreeDots } from "react-icons/bs";
import useTargetGrantPermissionModal from "../../../hooks/useTargetGrantPermissionModal";
import IconButton from "../../../utils/buttons/IconButton";
import { errorMessageNotificatition } from "../../../utils/errorHandling";
import { MenuInfo } from "../../../utils/types";
import { insertAntdMenuDivider } from "../../../utils/utils";

export interface FileMenuProps {
  file: File;
  workspaceRootname: string;
  onScheduleDeleteSuccess: () => void;
}

enum MenuKeys {
  DeleteItem = "delete-item",
  UpdateItem = "update-item",
  GrantPermission = "grant-permission",
}

const FileMenu: React.FC<FileMenuProps> = (props) => {
  const { file, workspaceRootname, onScheduleDeleteSuccess } = props;
  const permissionsHook = useTargetGrantPermissionModal({
    workspaceId: file.workspaceId,
    targetId: file.resourceId,
  });
  const deleteHook = useWorkspaceFileDeleteMutationHook({
    onSuccess(data, params) {
      message.success("File scheduled for deletion.");
      onScheduleDeleteSuccess();
    },
    onError(e, params) {
      errorMessageNotificatition(e, "Error deleting file.");
    },
  });

  const onSelectMenuItem = React.useCallback(
    (info: MenuInfo) => {
      if (info.key === MenuKeys.DeleteItem) {
        Modal.confirm({
          title: "Are you sure you want to delete this file?",
          okText: "Yes",
          cancelText: "No",
          okType: "primary",
          okButtonProps: { danger: true },
          onOk: async () => {
            await deleteHook.runAsync({
              body: {
                filepath: addRootnameToPath(
                  file.namePath.join(folderConstants.nameSeparator),
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
    },
    [deleteHook, permissionsHook.toggle]
  );

  const items: MenuProps["items"] = insertAntdMenuDivider([
    {
      key: MenuKeys.UpdateItem,
      label: (
        <Link
          href={appWorkspacePaths.fileForm(file.workspaceId, file.resourceId)}
        >
          Update File
        </Link>
      ),
    },
    {
      key: MenuKeys.GrantPermission,
      label: "Permissions",
    },
    {
      key: MenuKeys.DeleteItem,
      label: "Delete File",
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
        <IconButton icon={<BsThreeDots />} />
      </Dropdown>
      {permissionsHook.node}
    </React.Fragment>
  );
};

export default FileMenu;
