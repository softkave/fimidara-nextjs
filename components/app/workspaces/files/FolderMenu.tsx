import { getPublicFimidaraEndpointsUsingUserToken } from "@/lib/api/fimidaraEndpoints";
import { addRootnameToPath, folderConstants } from "@/lib/definitions/folder";
import { PermissionItemAppliesTo } from "@/lib/definitions/permissionItem";
import { AppResourceType, appWorkspacePaths } from "@/lib/definitions/system";
import { getUseFileListHookKey } from "@/lib/hooks/workspaces/useFileList";
import { getUseFolderHookKey } from "@/lib/hooks/workspaces/useFolder";
import { useRequest } from "ahooks";
import { Dropdown, MenuProps, message, Modal } from "antd";
import { Folder } from "fimidara";
import Link from "next/link";
import React from "react";
import { BsThreeDots } from "react-icons/bs";
import { useSWRConfig } from "swr";
import useGrantPermission from "../../../hooks/useGrantPermission";
import IconButton from "../../../utils/buttons/IconButton";
import { errorMessageNotificatition } from "../../../utils/errorHandling";
import { appClasses } from "../../../utils/theme";
import { MenuInfo } from "../../../utils/types";

export interface FolderMenuProps {
  folder: Folder;
  workspaceRootname: string;
}

enum MenuKeys {
  ViewItem = "view-item",
  DeleteItem = "delete-item",
  UpdateItem = "update-item",
  GrantPermission = "grant-permission",
  ChildrenFoldersGrantPermission = "chilldren-folders-grant-permission",
  ChildrenFilesGrantPermission = "children-files-grant-permission",
}

const FolderMenu: React.FC<FolderMenuProps> = (props) => {
  const { folder, workspaceRootname } = props;
  const folderGrantPermission = useGrantPermission({
    workspaceId: folder.workspaceId,
    targetType: AppResourceType.Folder,
    containerId: folder.parentId || folder.workspaceId,
    containerType: folder.parentId
      ? AppResourceType.Folder
      : AppResourceType.Workspace,
    targetId: folder.resourceId,
    appliesTo: PermissionItemAppliesTo.Container,
  });

  const childrenFoldersGrantPermission = useGrantPermission({
    workspaceId: folder.workspaceId,
    targetType: AppResourceType.Folder,
    containerId: folder.resourceId,
    containerType: AppResourceType.Folder,
    appliesTo: PermissionItemAppliesTo.Children,
  });

  const childrenFilesGrantPermission = useGrantPermission({
    workspaceId: folder.workspaceId,
    targetType: AppResourceType.File,
    containerId: folder.resourceId,
    containerType: AppResourceType.Folder,
    appliesTo: PermissionItemAppliesTo.Children,
  });

  const { mutate: cacheMutate } = useSWRConfig();
  const deleteItem = React.useCallback(async () => {
    try {
      const endpoints = getPublicFimidaraEndpointsUsingUserToken();
      await endpoints.folders.deleteFolder({
        body: {
          folderpath: addRootnameToPath(
            folder.namePath.join(folderConstants.nameSeparator),
            workspaceRootname
          ),
        },
      });

      message.success("Folder deleted.");
      cacheMutate(getUseFileListHookKey({ folderId: folder.parentId }));
      cacheMutate(getUseFolderHookKey({ folderId: folder.resourceId }));
    } catch (error: any) {
      errorMessageNotificatition(error, "Error deleting folder.");
    }
  }, [folder, cacheMutate, workspaceRootname]);

  const deleteItemHelper = useRequest(deleteItem, { manual: true });
  const onSelectMenuItem = React.useCallback(
    (info: MenuInfo) => {
      if (info.key === MenuKeys.DeleteItem) {
        Modal.confirm({
          title: "Are you sure you want to delete this folder?",
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
        folderGrantPermission.toggleVisibility();
      } else if (info.key === MenuKeys.ChildrenFoldersGrantPermission) {
        childrenFoldersGrantPermission.toggleVisibility();
      } else if (info.key === MenuKeys.ChildrenFilesGrantPermission) {
        childrenFilesGrantPermission.toggleVisibility();
      }
    },
    [
      deleteItemHelper,
      folderGrantPermission,
      childrenFilesGrantPermission,
      childrenFoldersGrantPermission,
    ]
  );

  const items: MenuProps["items"] = [
    {
      key: MenuKeys.ViewItem,
      label: (
        <Link
          href={appWorkspacePaths.folderPage(
            folder.workspaceId,
            folder.resourceId
          )}
        >
          Open Folder
        </Link>
      ),
    },
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
      label: "Folder Permissions",
    },
    {
      key: MenuKeys.ChildrenFilesGrantPermission,
      label: "Children File Permissions",
    },
    {
      key: MenuKeys.ChildrenFoldersGrantPermission,
      label: "Children Folder Permissions",
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
        <IconButton className={appClasses.iconBtn} icon={<BsThreeDots />} />
      </Dropdown>
      {folderGrantPermission.grantPermissionFormNode}
      {childrenFoldersGrantPermission.grantPermissionFormNode}
      {childrenFilesGrantPermission.grantPermissionFormNode}
    </React.Fragment>
  );
};

export default FolderMenu;
