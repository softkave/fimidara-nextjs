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
import { IFile } from "../../../../lib/definitions/file";
import FileAPI from "../../../../lib/api/endpoints/file";
import { folderConstants } from "../../../../lib/definitions/folder";
import { useSWRConfig } from "swr";
import { getUseFileListHookKey } from "../../../../lib/hooks/orgs/useFileList";
import { getUseFileHookKey } from "../../../../lib/hooks/orgs/useFile";

export interface IFileMenuProps {
  file: IFile;
}

enum MenuKeys {
  DeleteItem = "delete-item",
  UpdateItem = "update-item",
  GrantPermission = "grant-permission",
}

const FileMenu: React.FC<IFileMenuProps> = (props) => {
  const { file } = props;
  const { grantPermissionFormNode, toggleVisibility } = useGrantPermission({
    orgId: file.organizationId,
    itemResourceType: AppResourceType.File,
    permissionOwnerId: file.folderId || file.organizationId,
    permissionOwnerType: file.folderId
      ? AppResourceType.Folder
      : AppResourceType.Organization,
    itemResourceId: file.resourceId,
  });

  const { mutate: cacheMutate } = useSWRConfig();
  const deleteItem = React.useCallback(async () => {
    try {
      const result = await FileAPI.deleteFile({
        organizationId: file.organizationId,
        filePath: file.namePath.join(folderConstants.nameSeparator),
      });

      checkEndpointResult(result);
      message.success("File deleted");
      cacheMutate(
        getUseFileListHookKey({
          organizationId: file.organizationId,
          folderId: file.folderId,
        })
      );

      cacheMutate(
        getUseFileHookKey({
          organizationId: file.organizationId,
          fileId: file.resourceId,
        })
      );
    } catch (error: any) {
      message.error(
        getFormError(processEndpointError(error)) || "Error deleting file"
      );
    }
  }, [file, cacheMutate]);

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
                href={appOrgPaths.fileForm(
                  file.organizationId,
                  file.resourceId
                )}
              >
                Update File
              </Link>
            </Menu.Item>
            <Menu.Divider key={"divider-01"} />
            <Menu.Item key={MenuKeys.GrantPermission}>
              Grant Permission
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
