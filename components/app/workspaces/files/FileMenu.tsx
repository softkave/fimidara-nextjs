import { useRequest } from "ahooks";
import { Button, Dropdown, Menu, message, Modal } from "antd";
import Link from "next/link";
import React from "react";
import { BsThreeDots } from "react-icons/bs";
import { useSWRConfig } from "swr";
import FileAPI from "../../../../lib/api/endpoints/file";
import { checkEndpointResult } from "../../../../lib/api/utils";
import { IFile } from "../../../../lib/definitions/file";
import {
  addRootnameToPath,
  folderConstants,
} from "../../../../lib/definitions/folder";
import { PermissionItemAppliesTo } from "../../../../lib/definitions/permissionItem";
import {
  AppResourceType,
  appWorkspacePaths,
} from "../../../../lib/definitions/system";
import { getUseFileHookKey } from "../../../../lib/hooks/workspaces/useFile";
import { getUseFileListHookKey } from "../../../../lib/hooks/workspaces/useFileList";
import useGrantPermission from "../../../hooks/useGrantPermission";
import { errorMessageNotificatition } from "../../../utils/errorHandling";
import { appClasses } from "../../../utils/theme";
import { MenuInfo } from "../../../utils/types";

export interface IFileMenuProps {
  file: IFile;
  workspaceRootname: string;
}

enum MenuKeys {
  DeleteItem = "delete-item",
  UpdateItem = "update-item",
  GrantPermission = "grant-permission",
}

const FileMenu: React.FC<IFileMenuProps> = (props) => {
  const { file, workspaceRootname } = props;
  const { grantPermissionFormNode, toggleVisibility } = useGrantPermission({
    workspaceId: file.workspaceId,
    itemResourceType: AppResourceType.File,
    permissionOwnerId: file.folderId || file.workspaceId,
    permissionOwnerType: file.folderId
      ? AppResourceType.Folder
      : AppResourceType.Workspace,
    itemResourceId: file.resourceId,
    appliesTo: PermissionItemAppliesTo.Children,
  });

  const { mutate: cacheMutate } = useSWRConfig();
  const deleteItem = React.useCallback(async () => {
    try {
      const result = await FileAPI.deleteFile({
        filepath: addRootnameToPath(
          file.namePath.join(folderConstants.nameSeparator),
          workspaceRootname
        ),
      });

      checkEndpointResult(result);
      message.success("File deleted");
      cacheMutate(
        getUseFileListHookKey({
          folderId: file.folderId,
        })
      );

      cacheMutate(
        getUseFileHookKey({
          fileId: file.resourceId,
        })
      );
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

  return (
    <React.Fragment>
      <Dropdown
        disabled={deleteItemHelper.loading}
        trigger={["click"]}
        overlay={
          <Menu onClick={onSelectMenuItem} style={{ minWidth: "150px" }}>
            <Menu.Item key={MenuKeys.UpdateItem}>
              <Link
                href={appWorkspacePaths.fileForm(
                  file.workspaceId,
                  file.resourceId
                )}
              >
                Update File
              </Link>
            </Menu.Item>
            <Menu.Divider key={"divider-01"} />
            <Menu.Item key={MenuKeys.GrantPermission}>
              Grant Access To Resource
            </Menu.Item>
            <Menu.Divider key={"divider-02"} />
            <Menu.Item key={MenuKeys.DeleteItem}>Delete File</Menu.Item>
          </Menu>
        }
      >
        <Button
          // type="text"
          className={appClasses.iconBtn}
          icon={<BsThreeDots />}
        ></Button>
      </Dropdown>
      {grantPermissionFormNode}
    </React.Fragment>
  );
};

export default FileMenu;
