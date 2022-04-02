import { List } from "antd";
import React from "react";
import {
  actionLabel,
  AppResourceType,
  BasicCRUDActions,
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

function getActions(type: AppResourceType) {
  const actions = [
    BasicCRUDActions.All,
    BasicCRUDActions.Create,
    BasicCRUDActions.Read,
    BasicCRUDActions.Update,
    BasicCRUDActions.Delete,
  ];

  if (type === AppResourceType.Organization) {
    return actions.concat(BasicCRUDActions.GrantPermission);
  }

  return actions;
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
      dataSource={getActions(itemResourceType)}
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
              label={actionLabel[action]}
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
