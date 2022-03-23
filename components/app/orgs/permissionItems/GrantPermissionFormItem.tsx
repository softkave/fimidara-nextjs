import { Collapse } from "antd";
import React from "react";
import { INewPermissionItemInputByResource } from "../../../../lib/api/endpoints/permissionItem";
import {
  AppResourceType,
  BasicCRUDActions,
} from "../../../../lib/definitions/system";
import GrantPermissionAction, {
  IGrantPermissionActionChange,
} from "./GrantPermissionAction";

export interface IGrantPermissionFormItemProps {
  loading?: boolean;
  id: string;
  permissionEntityId: string;
  name: string;
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
  return (
    item.permissionEntityId +
    "-" +
    item.permissionEntityType +
    "-" +
    item.action
  );
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
    name,
    permissionEntityId,
    permissionEntityType,
    permissionItems,
    id,
    onChange,
  } = props;

  return (
    <Collapse.Panel key={id} header={name}>
      {getActions(itemResourceType).map((action) => {
        const item =
          permissionItems[
            getItemKeyByEntity({
              permissionEntityId,
              permissionEntityType,
              action,
            })
          ];

        return (
          <GrantPermissionAction
            label={action}
            onChange={(permitted, update) =>
              onChange(item, action, permitted, update)
            }
            hasChildren={itemResourceType === AppResourceType.Folder}
            isForOwner={item?.isForPermissionOwnerOnly}
            permitted={!!item && !item.isExclusion}
            disabled={loading}
          />
        );
      })}
    </Collapse.Panel>
  );
};

export default GrantPermissionFormItem;
