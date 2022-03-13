import { Button, Dropdown, Menu, message, Modal } from "antd";
import Link from "next/link";
import React from "react";
import { appOrgPaths } from "../../../../lib/definitions/system";
import { appClasses } from "../../../utils/theme";
import {
  checkEndpointResult,
  processEndpointError,
} from "../../../../lib/api/utils";
import { useRequest } from "ahooks";
import { SelectInfo } from "../../../utils/types";
import { ICollaborator } from "../../../../lib/definitions/user";
import CollaboratorAPI from "../../../../lib/api/endpoints/collaborators";
import { BsThreeDots } from "react-icons/bs";
import { getFormError } from "../../../form/formUtils";

export interface ICollaboratorMenuProps {
  orgId: string;
  collaborator: ICollaborator;
  onCompleteRemove: () => any;
}

enum MenuKeys {
  DeleteItem = "delete-item",
  UpdateItem = "update-item",
}

const CollaboratorMenu: React.FC<ICollaboratorMenuProps> = (props) => {
  const { orgId, collaborator, onCompleteRemove } = props;
  const deleteItem = React.useCallback(async () => {
    try {
      const result = await CollaboratorAPI.removeCollaborator({
        organizationId: orgId,
        collaboratorId: collaborator.resourceId,
      });

      checkEndpointResult(result);
      message.success("Collaborator removed");
      onCompleteRemove();
    } catch (error: any) {
      message.error(
        getFormError(processEndpointError(error)) ||
          "Error removing collaborator"
      );
    }
  }, [orgId, collaborator, onCompleteRemove]);

  const deleteItemHelper = useRequest(deleteItem, { manual: true });
  const onSelectMenuItem = React.useCallback(
    (info: SelectInfo) => {
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
      }
    },
    [deleteItemHelper]
  );

  return (
    <Dropdown
      disabled={deleteItemHelper.loading}
      trigger={["click"]}
      overlay={
        <Menu onSelect={onSelectMenuItem} style={{ minWidth: "150px" }}>
          <Menu.Item key={MenuKeys.UpdateItem}>
            <Link
              href={appOrgPaths.collaboratorForm(
                orgId,
                collaborator.resourceId
              )}
            >
              Update Permission Groups
            </Link>
          </Menu.Item>
          <Menu.Divider key={"divider-01"} />
          <Menu.Item key={MenuKeys.DeleteItem}>Remove Collaborator</Menu.Item>
        </Menu>
      }
    >
      <Button
        type="text"
        className={appClasses.iconBtn}
        icon={<BsThreeDots />}
      ></Button>
    </Dropdown>
  );
};

export default CollaboratorMenu;
