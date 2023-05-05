import { getPublicFimidaraEndpointsUsingUserToken } from "@/lib/api/fimidaraEndpoints";
import { addRootnameToPath, folderConstants } from "@/lib/definitions/folder";
import { PermissionItemAppliesTo } from "@/lib/definitions/permissionItem";
import { AppResourceType, appWorkspacePaths } from "@/lib/definitions/system";
import { getUseFileHookKey } from "@/lib/hooks/workspaces/useFile";
import { getUseFileListHookKey } from "@/lib/hooks/workspaces/useFileList";
import { useRequest } from "ahooks";
import { Dropdown, MenuProps, message, Modal } from "antd";
import { File } from "fimidara";
import Link from "next/link";
import React from "react";
import { BsThreeDots } from "react-icons/bs";
import { useSWRConfig } from "swr";
import useGrantPermission from "../../../hooks/useGrantPermission";
import IconButton from "../../../utils/buttons/IconButton";
import { errorMessageNotificatition } from "../../../utils/errorHandling";
import { MenuInfo } from "../../../utils/types";

export interface FileMenuProps {
  file: File;
  workspaceRootname: string;
}

enum MenuKeys {
  DeleteItem = "delete-item",
  UpdateItem = "update-item",
  GrantPermission = "grant-permission",
}

const FileMenu: React.FC<FileMenuProps> = (props) => {
  const { file, workspaceRootname } = props;
  const { grantPermissionFormNode, toggleVisibility } = useGrantPermission({
    workspaceId: file.workspaceId,
    targetType: AppResourceType.File,
    containerId: file.parentId || file.workspaceId,
    containerType: file.parentId
      ? AppResourceType.Folder
      : AppResourceType.Workspace,
    targetId: file.resourceId,
    appliesTo: PermissionItemAppliesTo.Children,
  });

  const { mutate: cacheMutate } = useSWRConfig();

  const deleteItem = React.useCallback(async () => {
    try {
      const endpoints = getPublicFimidaraEndpointsUsingUserToken();
      await endpoints.files.deleteFile({
        body: {
          filepath: addRootnameToPath(
            file.namePath.join(folderConstants.nameSeparator),
            workspaceRootname
          ),
        },
      });

      // TODO: have a jobs bar or notification on long running jobs completion
      message.success("File scheduled for deletion.");
      cacheMutate(getUseFileListHookKey({ folderId: file.parentId }));
      cacheMutate(getUseFileHookKey({ fileId: file.resourceId }));
    } catch (error: any) {
      errorMessageNotificatition(error, "Error deleting file");
    }
  }, [file, cacheMutate, workspaceRootname]);

  const deleteItemHelper = useRequest(deleteItem, { manual: true });
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
            await deleteItemHelper.runAsync();
          },
          onCancel() {
            // do nothing
          },
        });
      } else if (info.key === MenuKeys.GrantPermission) {
        toggleVisibility();
      }
    },
    [deleteItemHelper, toggleVisibility]
  );

  const items: MenuProps["items"] = [
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
  ];

  return (
    <React.Fragment>
      <Dropdown
        disabled={deleteItemHelper.loading}
        trigger={["click"]}
        menu={{
          items,
          style: { minWidth: "150px" },
          onClick: onSelectMenuItem,
        }}
      >
        <IconButton icon={<BsThreeDots />} />
      </Dropdown>
      {grantPermissionFormNode}
    </React.Fragment>
  );
};

export default FileMenu;
