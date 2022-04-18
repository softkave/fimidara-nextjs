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
import {
  CollaborationRequestStatusType,
  ICollaborationRequest,
} from "../../../../lib/definitions/collaborationRequest";
import CollaborationRequestAPI from "../../../../lib/api/endpoints/collaborationRequest";
import { last } from "lodash";
import { BsThreeDots } from "react-icons/bs";
import { getFormError } from "../../../form/formUtils";
import useGrantPermission from "../../../hooks/useGrantPermission";
import { PermissionItemAppliesTo } from "../../../../lib/definitions/permissionItem";

export interface IWorkspaceRequestMenuProps {
  request: ICollaborationRequest;
  onCompleteDeleteRequest: () => void;
}

enum MenuKeys {
  DeleteItem = "delete-item",
  UpdateItem = "update-item",
  GrantPermission = "grant-permission",
}

const WorkspaceRequestMenu: React.FC<IWorkspaceRequestMenuProps> = (props) => {
  const { request, onCompleteDeleteRequest } = props;
  const { grantPermissionFormNode, toggleVisibility } = useGrantPermission({
    workspaceId: request.workspaceId,
    itemResourceType: AppResourceType.CollaborationRequest,
    permissionOwnerId: request.workspaceId,
    permissionOwnerType: AppResourceType.Workspace,
    itemResourceId: request.resourceId,
    appliesTo: PermissionItemAppliesTo.Children,
  });

  const deleteItem = React.useCallback(async () => {
    try {
      const result = await CollaborationRequestAPI.deleteRequest({
        requestId: request.resourceId,
      });

      checkEndpointResult(result);
      message.success("Request sent");
      await onCompleteDeleteRequest();
    } catch (error: any) {
      message.error(
        getFormError(processEndpointError(error)) || "Error deleting request"
      );
    }
  }, [request, onCompleteDeleteRequest]);

  const deleteItemHelper = useRequest(deleteItem, { manual: true });
  const onSelectMenuItem = React.useCallback(
    (info: MenuInfo) => {
      if (info.key === MenuKeys.DeleteItem) {
        Modal.confirm({
          title: "Are you sure you want to delete this collaboration request?",
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

  const status = last(request.statusHistory);
  const isPending = status?.status === CollaborationRequestStatusType.Pending;
  return (
    <React.Fragment>
      <Dropdown
        disabled={deleteItemHelper.loading}
        trigger={["click"]}
        overlay={
          <Menu onClick={onSelectMenuItem} style={{ minWidth: "150px" }}>
            <Menu.Item key={MenuKeys.UpdateItem} disabled={!isPending}>
              <Link
                href={appWorkspacePaths.requestForm(
                  request.workspaceId,
                  request.resourceId
                )}
              >
                Update Request
              </Link>
            </Menu.Item>
            <Menu.Divider key={"divider-01"} />
            <Menu.Item key={MenuKeys.GrantPermission}>
              Grant Permission
            </Menu.Item>
            <Menu.Divider key={"divider-02"} />
            <Menu.Item key={MenuKeys.DeleteItem} disabled={!isPending}>
              Delete Request
            </Menu.Item>
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

export default WorkspaceRequestMenu;