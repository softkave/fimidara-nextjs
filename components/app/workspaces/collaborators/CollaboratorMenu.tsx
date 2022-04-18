import { Button, Dropdown, Menu, message, Modal } from "antd";
import Link from "next/link";
import React from "react";
import {
  appWorkspacePaths,
  AppResourceType,
} from "../../../../lib/definitions/system";
import { appClasses } from "../../../utils/theme";
import {
  checkEndpointResult,
  processEndpointError,
} from "../../../../lib/api/utils";
import { useRequest } from "ahooks";
import { MenuInfo } from "../../../utils/types";
import { ICollaborator } from "../../../../lib/definitions/user";
import CollaboratorAPI from "../../../../lib/api/endpoints/collaborators";
import { BsThreeDots } from "react-icons/bs";
import { getFormError } from "../../../form/formUtils";
import useGrantPermission from "../../../hooks/useGrantPermission";
import { PermissionItemAppliesTo } from "../../../../lib/definitions/permissionItem";

export interface ICollaboratorMenuProps {
  workspaceId: string;
  collaborator: ICollaborator;
  onCompleteRemove: () => any;
}

enum MenuKeys {
  DeleteItem = "delete-item",
  UpdateItem = "update-item",
  GrantPermission = "grant-permission",
}

const CollaboratorMenu: React.FC<ICollaboratorMenuProps> = (props) => {
  const { workspaceId, collaborator, onCompleteRemove } = props;
  const { grantPermissionFormNode, toggleVisibility } = useGrantPermission({
    workspaceId,
    itemResourceType: AppResourceType.User,
    permissionOwnerId: workspaceId,
    permissionOwnerType: AppResourceType.Workspace,
    itemResourceId: collaborator.resourceId,
    appliesTo: PermissionItemAppliesTo.Children,
  });

  const deleteItem = React.useCallback(async () => {
    try {
      const result = await CollaboratorAPI.removeCollaborator({
        workspaceId: workspaceId,
        collaboratorId: collaborator.resourceId,
      });

      checkEndpointResult(result);
      message.success("Collaborator removed");
      await onCompleteRemove();
    } catch (error: any) {
      message.error(
        getFormError(processEndpointError(error)) ||
          "Error removing collaborator"
      );
    }
  }, [workspaceId, collaborator, onCompleteRemove]);

  const deleteItemHelper = useRequest(deleteItem, { manual: true });
  const onSelectMenuItem = React.useCallback(
    (info: MenuInfo) => {
      if (info.key === MenuKeys.DeleteItem) {
        Modal.confirm({
          title: "Are you sure you want to remove this collaborator?",
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
                href={appWorkspacePaths.collaboratorForm(
                  workspaceId,
                  collaborator.resourceId
                )}
              >
                Update Permission Groups
              </Link>
            </Menu.Item>
            <Menu.Divider key={"divider-01"} />
            <Menu.Item key={MenuKeys.GrantPermission}>
              Grant Permission
            </Menu.Item>
            <Menu.Divider key={"divider-02"} />
            <Menu.Item key={MenuKeys.DeleteItem}>Remove Collaborator</Menu.Item>
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

export default CollaboratorMenu;