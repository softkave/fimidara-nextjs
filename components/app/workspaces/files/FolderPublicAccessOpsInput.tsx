import {
  AppResourceType,
  BasicCRUDActions,
  IPublicAccessOpInput,
  actionLabel,
  appResourceTypeLabel,
  getActions,
} from "@/lib/definitions/system";
import { List, Select, Space } from "antd";
import React from "react";
import { filterOption, filterSort } from "../../../form/formUtils";

export type ResourcePublicAccessAction = BasicCRUDActions;
export type FolderChildrenTypes = AppResourceType.File | AppResourceType.Folder;
const fileActions = getActions(
  AppResourceType.File
) as ResourcePublicAccessAction[];

const folderActions = getActions(
  AppResourceType.Folder
) as ResourcePublicAccessAction[];

const actions: Record<FolderChildrenTypes, ResourcePublicAccessAction[]> = {
  [AppResourceType.File]: fileActions,
  [AppResourceType.Folder]: folderActions,
};

export interface IResourcePublicAccessActions {
  actions: ResourcePublicAccessAction[];
  resourceType: FolderChildrenTypes;
}

export function resourceListPublicAccessActionsToPublicAccessOps(
  items: IResourcePublicAccessActions[]
) {
  const ops: IPublicAccessOpInput[] = [];
  for (const item of items) {
    for (const action of item.actions) {
      ops.push({
        action,
        resourceType: item.resourceType,
      });
    }
  }

  return ops;
}

export interface IFolderPublicAccessOpsInputProps {
  disabled?: boolean;
  value: IResourcePublicAccessActions[];
  onChange: (value: IResourcePublicAccessActions[]) => void;
}

const FolderPublicAccessOpsInput: React.FC<IFolderPublicAccessOpsInputProps> = (
  props
) => {
  const { value, disabled, onChange } = props;
  const onUpdateItem = React.useCallback(
    (resourceType: AppResourceType, actions: BasicCRUDActions[]) => {
      const newValue = value.map((item) => {
        return item.resourceType === resourceType ? { ...item, actions } : item;
      });
      onChange(newValue);
    },
    [value, onChange]
  );

  const opListNode = (
    <List
      itemLayout="horizontal"
      dataSource={value}
      renderItem={(item) => {
        return (
          <List.Item key={item.resourceType}>
            <Select
              showSearch
              disabled
              style={{ width: "100%" }}
              placeholder="Resource type"
              optionLabelProp="label"
              value={item.resourceType}
              optionFilterProp="label"
              filterOption={filterOption}
              filterSort={filterSort}
            >
              {[AppResourceType.Folder, AppResourceType.File].map((item) => (
                <Select.Option key={item} label={item} value={item}>
                  {appResourceTypeLabel[item]}
                </Select.Option>
              ))}
            </Select>
            <Select
              showSearch
              mode="multiple"
              style={{ width: "100%" }}
              placeholder="Permitted actions"
              maxTagCount="responsive"
              disabled={disabled}
              optionLabelProp="label"
              value={value.map((item) => item.actions) as any}
              onSelect={(actions: BasicCRUDActions[]) =>
                onUpdateItem(item.resourceType, actions)
              }
              optionFilterProp="label"
              filterOption={filterOption}
              filterSort={filterSort}
            >
              {actions[item.resourceType].map((item) => (
                <Select.Option key={item} label={item} value={item}>
                  {actionLabel[item]}
                </Select.Option>
              ))}
            </Select>
          </List.Item>
        );
      }}
    />
  );

  return (
    <Space direction="vertical" size={"middle"} style={{ width: "100%" }}>
      {opListNode}
    </Space>
  );
};

export default FolderPublicAccessOpsInput;
