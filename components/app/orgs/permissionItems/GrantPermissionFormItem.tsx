import { List } from "antd";
import React from "react";
import { INewPermissionItemInputByResource } from "../../../../lib/api/endpoints/permissionItem";
import {
  actionLabel,
  AppResourceType,
  BasicCRUDActions,
} from "../../../../lib/definitions/system";
import { makeKey } from "../../../../lib/utilities/fns";
import GrantPermissionAction, {
  IGrantPermissionActionChange,
} from "./GrantPermissionAction";

export interface IGrantPermissionFormItemProps {
  loading?: boolean;
  permissionEntityId: string;
  permissionEntityType: AppResourceType;
  permissionItems: Record<string, INewPermissionItemInputByResource>;
  itemResourceType: AppResourceType;
  onChange: (
    item: INewPermissionItemInputByResource,
    action: BasicCRUDActions,
    permitted: boolean,
    change?: IGrantPermissionActionChange
  ) => void;
}

export function getItemKeyByEntity(item: {
  permissionEntityId: string;
  permissionEntityType: AppResourceType;
  action: BasicCRUDActions;
}) {
  return makeKey([
    item.permissionEntityId,
    item.permissionEntityType,
    item.action,
  ]);
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
    permissionItems,
    onChange,
  } = props;

  const everyActionItem =
    permissionItems[
      getItemKeyByEntity({
        permissionEntityId,
        permissionEntityType,
        action: BasicCRUDActions.All,
      })
    ];

  return (
    <List
      dataSource={getActions(itemResourceType)}
      renderItem={(action) => {
        const item =
          permissionItems[
            getItemKeyByEntity({
              permissionEntityId,
              permissionEntityType,
              action,
            })
          ];

        return (
          <List.Item>
            <GrantPermissionAction
              key={action}
              label={actionLabel[action]}
              onChange={(permitted, update) =>
                onChange(item, action, permitted, update)
              }
              // hasChildren={!!(permissionOwnerType === AppResourceType.Folder)}
              isForOwner={item?.isForPermissionOwnerOnly}
              permitted={!!everyActionItem || (!!item && !item.isExclusion)}
              disabled={loading}
            />
          </List.Item>
        );
      }}
    />
  );
};

export default GrantPermissionFormItem;
