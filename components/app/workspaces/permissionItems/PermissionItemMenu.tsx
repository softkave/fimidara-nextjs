import { Button, message, Modal } from "antd";
import React from "react";
import { appClasses } from "../../../utils/theme";
import { checkEndpointResult } from "../../../../lib/api/utils";
import { useRequest } from "ahooks";
import { IPermissionItem } from "../../../../lib/definitions/permissionItem";
import PermissionItemAPI from "../../../../lib/api/endpoints/permissionItem";
import { DeleteOutlined } from "@ant-design/icons";
import { errorMessageNotificatition } from "../../../utils/errorHandling";

export interface IPermissionItemMenuProps {
  item: IPermissionItem;
  onCompleteDelete: () => any;
}

const PermissionItemMenu: React.FC<IPermissionItemMenuProps> = (props) => {
  const { item, onCompleteDelete } = props;
  const deleteItem = React.useCallback(async () => {
    try {
      // TODO: invalidate all the data that has assigned permissionGroups
      // when request is successful

      const result = await PermissionItemAPI.deleteItemsById({
        itemIds: [item.resourceId],
        workspaceId: item.workspaceId,
      });

      checkEndpointResult(result);
      message.success("Permission item deleted");
      await onCompleteDelete();
    } catch (error: any) {
      errorMessageNotificatition(error, "Error deleting permission item");
    }
  }, [item, onCompleteDelete]);

  const deleteItemHelper = useRequest(deleteItem, { manual: true });
  const onDeleteItem = React.useCallback(() => {
    Modal.confirm({
      title: "Are you sure you want to delete this permission item?",
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
  }, [deleteItemHelper]);

  return (
    <Button
      // type="text"
      className={appClasses.iconBtn}
      icon={<DeleteOutlined />}
      onClick={onDeleteItem}
      disabled={deleteItemHelper.loading}
    ></Button>
  );
};

export default PermissionItemMenu;
