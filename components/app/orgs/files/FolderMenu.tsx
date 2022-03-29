import { Button, Dropdown, Menu, message, Modal } from "antd";
import Link from "next/link";
import React from "react";
import {
  appOrgPaths,
  AppResourceType,
} from "../../../../lib/definitions/system";
import { appClasses } from "../../../utils/theme";
import {
  checkEndpointResult,
  processEndpointError,
} from "../../../../lib/api/utils";
import { useRequest } from "ahooks";
import { MenuInfo } from "../../../utils/types";
import { BsThreeDots } from "react-icons/bs";
import { getFormError } from "../../../form/formUtils";
import useGrantPermission from "../../../hooks/useGrantPermission";
import { IFolder } from "../../../../lib/definitions/folder";
import FolderAPI from "../../../../lib/api/endpoints/folder";
import { folderConstants } from "../../../../lib/definitions/folder";
import { useSWRConfig } from "swr";
import { getUseFileListHookKey } from "../../../../lib/hooks/orgs/useFileList";
import { getUseFolderHookKey } from "../../../../lib/hooks/orgs/useFolder";

export interface IFolderMenuProps {
  folder: IFolder;
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
  const { folder } = props;
  const folderGrantPermission = useGrantPermission({
    orgId: folder.organizationId,
    itemResourceType: AppResourceType.Folder,
    permissionOwnerId: folder.parentId || folder.organizationId,
    permissionOwnerType: folder.parentId
      ? AppResourceType.Folder
      : AppResourceType.Organization,
    itemResourceId: folder.resourceId,
  });

  const childrenFoldersGrantPermission = useGrantPermission({
    orgId: folder.organizationId,
    itemResourceType: AppResourceType.Folder,
    permissionOwnerId: folder.resourceId,
    permissionOwnerType: AppResourceType.Folder,
  });

  const childrenFilesGrantPermission = useGrantPermission({
    orgId: folder.organizationId,
    itemResourceType: AppResourceType.File,
    permissionOwnerId: folder.resourceId,
    permissionOwnerType: AppResourceType.Folder,
  });

  const { mutate: cacheMutate } = useSWRConfig();
  const deleteItem = React.useCallback(async () => {
    try {
      const result = await FolderAPI.deleteFolder({
        organizationId: folder.organizationId,
        folderPath: folder.namePath.join(folderConstants.nameSeparator),
      });

      checkEndpointResult(result);
      message.success("Folder deleted");
      cacheMutate(
        getUseFileListHookKey({
          organizationId: folder.organizationId,
          folderId: folder.parentId,
        })
      );

      cacheMutate(
        getUseFolderHookKey({
          organizationId: folder.organizationId,
          folderId: folder.resourceId,
        })
      );
    } catch (error: any) {
      message.error(
        getFormError(processEndpointError(error)) || "Error deleting folder"
      );
    }
  }, [folder, cacheMutate]);

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
        console.log(MenuKeys.GrantPermission);
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
                href={appOrgPaths.folderPage(
                  folder.organizationId,
                  folder.resourceId
                )}
              >
                View Folder
              </Link>
            </Menu.Item>
            <Menu.Divider key={"divider-00"} />
            <Menu.Item key={MenuKeys.UpdateItem}>
              <Link
                href={appOrgPaths.folderForm(
                  folder.organizationId,
                  folder.resourceId
                )}
              >
                Update Folder
              </Link>
            </Menu.Item>
            <Menu.Divider key={"divider-01"} />
            <Menu.Item key={MenuKeys.GrantPermission}>
              Grant Permission to Folder
            </Menu.Item>
            <Menu.Divider key={"divider-02"} />
            <Menu.Item key={MenuKeys.ChildrenFoldersGrantPermission}>
              Grant Permission To Children Folders
            </Menu.Item>
            <Menu.Divider key={"divider-03"} />
            <Menu.Item key={MenuKeys.ChildrenFilesGrantPermission}>
              Grant Permission to Children Files
            </Menu.Item>
            <Menu.Divider key={"divider-04"} />
            <Menu.Item key={MenuKeys.DeleteItem}>Delete Folder</Menu.Item>
          </Menu>
        }
      >
        <Button
          type="text"
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
