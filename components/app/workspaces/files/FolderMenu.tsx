import { useRequest } from "ahooks";
import { Button, Dropdown, Menu, message, Modal } from "antd";
import Link from "next/link";
import React from "react";
import { BsThreeDots } from "react-icons/bs";
import { useSWRConfig } from "swr";
import FolderAPI from "../../../../lib/api/endpoints/folder";
import { checkEndpointResult } from "../../../../lib/api/utils";
import {
  addRootnameToPath,
  folderConstants,
  IFolder,
} from "../../../../lib/definitions/folder";
import { PermissionItemAppliesTo } from "../../../../lib/definitions/permissionItem";
import {
  AppResourceType,
  appWorkspacePaths,
} from "../../../../lib/definitions/system";
import { getUseFileListHookKey } from "../../../../lib/hooks/workspaces/useFileList";
import { getUseFolderHookKey } from "../../../../lib/hooks/workspaces/useFolder";
import useGrantPermission from "../../../hooks/useGrantPermission";
import { errorMessageNotificatition } from "../../../utils/errorHandling";
import { appClasses } from "../../../utils/theme";
import { MenuInfo } from "../../../utils/types";

export interface IFolderMenuProps {
  folder: IFolder;
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

const FolderMenu: React.FC<IFolderMenuProps> = (props) => {
  const { folder, workspaceRootname } = props;
  const folderGrantPermission = useGrantPermission({
    workspaceId: folder.workspaceId,
    itemResourceType: AppResourceType.Folder,
    permissionOwnerId: folder.parentId || folder.workspaceId,
    permissionOwnerType: folder.parentId
      ? AppResourceType.Folder
      : AppResourceType.Workspace,
    itemResourceId: folder.resourceId,
    appliesTo: PermissionItemAppliesTo.Owner,
  });

  const childrenFoldersGrantPermission = useGrantPermission({
    workspaceId: folder.workspaceId,
    itemResourceType: AppResourceType.Folder,
    permissionOwnerId: folder.resourceId,
    permissionOwnerType: AppResourceType.Folder,
    appliesTo: PermissionItemAppliesTo.Children,
  });

  const childrenFilesGrantPermission = useGrantPermission({
    workspaceId: folder.workspaceId,
    itemResourceType: AppResourceType.File,
    permissionOwnerId: folder.resourceId,
    permissionOwnerType: AppResourceType.Folder,
    appliesTo: PermissionItemAppliesTo.Children,
  });

  const { mutate: cacheMutate } = useSWRConfig();
  const deleteItem = React.useCallback(async () => {
    try {
      const result = await FolderAPI.deleteFolder({
        folderpath: addRootnameToPath(
          folder.namePath.join(folderConstants.nameSeparator),
          workspaceRootname
        ),
      });

      checkEndpointResult(result);
      message.success("Folder deleted");
      cacheMutate(
        getUseFileListHookKey({
          folderId: folder.parentId,
        })
      );

      cacheMutate(
        getUseFolderHookKey({
          folderId: folder.resourceId,
        })
      );
    } catch (error: any) {
      errorMessageNotificatition(error, "Error deleting folder");
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

  return (
    <React.Fragment>
      <Dropdown
        disabled={deleteItemHelper.loading}
        trigger={["click"]}
        overlay={
          <Menu onClick={onSelectMenuItem} style={{ minWidth: "150px" }}>
            <Menu.Item key={MenuKeys.ViewItem}>
              <Link
                href={appWorkspacePaths.folderPage(
                  folder.workspaceId,
                  folder.resourceId
                )}
              >
                View Folder
              </Link>
            </Menu.Item>
            <Menu.Divider key={"divider-00"} />
            <Menu.Item key={MenuKeys.UpdateItem}>
              <Link
                href={appWorkspacePaths.folderForm(
                  folder.workspaceId,
                  folder.resourceId
                )}
              >
                Update Folder
              </Link>
            </Menu.Item>
            <Menu.Divider key={"divider-01"} />
            <Menu.Item key={MenuKeys.GrantPermission}>
              Grant Access To Folder
            </Menu.Item>
            <Menu.Divider key={"divider-02"} />
            <Menu.Item key={MenuKeys.ChildrenFoldersGrantPermission}>
              Grant Access To Children Folders
            </Menu.Item>
            <Menu.Divider key={"divider-03"} />
            <Menu.Item key={MenuKeys.ChildrenFilesGrantPermission}>
              Grant Access To Children Files
            </Menu.Item>
            <Menu.Divider key={"divider-04"} />
            <Menu.Item key={MenuKeys.DeleteItem}>Delete Folder</Menu.Item>
          </Menu>
        }
      >
        <Button
          // type="text"
          className={appClasses.iconBtn}
          icon={<BsThreeDots />}
        ></Button>
      </Dropdown>
      {folderGrantPermission.grantPermissionFormNode}
      {childrenFoldersGrantPermission.grantPermissionFormNode}
      {childrenFilesGrantPermission.grantPermissionFormNode}
    </React.Fragment>
  );
};

export default FolderMenu;
