import { List } from "antd";
import React from "react";
import {
  actionLabel,
  AppResourceType,
  BasicCRUDActions,
  getActions,
} from "../../../../lib/definitions/system";
import GrantPermissionAction from "./GrantPermissionAction";
import PermissionItemsByResourceController from "./PermissionItemsController";

export interface IGrantPermissionFormItemProps {
  loading?: boolean;
  permissionEntityId: string;
  permissionEntityType: AppResourceType;
  itemResourceType: AppResourceType;
  controller: PermissionItemsByResourceController;
  onChange: (
    permissionEntityId: string,
    permissionEntityType: AppResourceType,
    action: BasicCRUDActions,
    permitted: boolean
  ) => void;
}

const GrantPermissionFormItem: React.FC<IGrantPermissionFormItemProps> = (
  props
) => {
  const {
    itemResourceType,
    loading,
    permissionEntityId,
    permissionEntityType,
    controller,
    onChange,
  } = props;

  return (
    <List
      dataSource={getActions(itemResourceType, true)}
      renderItem={(action) => {
        let actionPermitted = controller.canPerformAction(
          permissionEntityId,
          permissionEntityType,
          action
        );

        return (
          <List.Item>
            <GrantPermissionAction
              key={action}
              label={action !== BasicCRUDActions.All ? actionLabel[action] : ""}
              onChange={(permitted) =>
                onChange(
                  permissionEntityId,
                  permissionEntityType,
                  action,
                  permitted
                )
              }
              permitted={actionPermitted}
              disabled={loading}
            />
          </List.Item>
        );
      }}
    />
  );
};

export default GrantPermissionFormItem;
