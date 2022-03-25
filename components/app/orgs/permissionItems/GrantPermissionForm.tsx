import { RightOutlined } from "@ant-design/icons";
import { Modal, Tabs } from "antd";
import React from "react";
import { INewPermissionItemInputByResource } from "../../../../lib/api/endpoints/permissionItem";
import { IClientAssignedToken } from "../../../../lib/definitions/clientAssignedToken";
import { IPermissionItem } from "../../../../lib/definitions/permissionItem";
import { IPresetPermissionsGroup } from "../../../../lib/definitions/presets";
import { IProgramAccessToken } from "../../../../lib/definitions/programAccessToken";
import {
  AppResourceType,
  BasicCRUDActions,
} from "../../../../lib/definitions/system";
import { ICollaborator } from "../../../../lib/definitions/user";
import OrganizationClientTokens from "../clientTokens/OrganizationClientTokens";
import OrganizationCollaborators from "../collaborators/OrganizationCollaborators";
import OrganizationPermissionGroups from "../permissionGroups/OrganizationPermissionGroups";
import OrganizationProgramTokens from "../programTokens/OrganizationProgramTokens";
import { IGrantPermissionActionChange } from "./GrantPermissionAction";
import GrantPermissionFormItem, {
  getItemKeyByEntity,
} from "./GrantPermissionFormItem";

export interface IGrantPermissionFormProps {
  loading?: boolean;
  orgId: string;
  itemResourceType: AppResourceType;
  permissionOwnerType: AppResourceType;
  existingPermissionItems: IPermissionItem[];
  onSave: (items: INewPermissionItemInputByResource[]) => void;
  onCancel: () => void;
}

enum TabKey {
  Collaborator = "collaborator",
  ProgramToken = "program-token",
  ClientToken = "client-token",
  PermissionGroup = "permission-group",
}

const GrantPermissionForm: React.FC<IGrantPermissionFormProps> = (props) => {
  const {
    orgId,
    itemResourceType,
    permissionOwnerType,
    existingPermissionItems,
    loading,
    onSave,
    onCancel,
  } = props;

  const [activeKey] = React.useState(TabKey.PermissionGroup);
  const [permissionItems, setPermissionItems] = React.useState<
    Record<string, INewPermissionItemInputByResource>
  >(() =>
    existingPermissionItems.reduce((map, itemInput) => {
      const item = {
        permissionEntityId: itemInput.permissionEntityId,
        permissionEntityType: itemInput.permissionEntityType,
        action: itemInput.action,
        isExclusion: itemInput.isExclusion,
        isForPermissionOwnerOnly: itemInput.isForPermissionOwnerOnly,
      };

      map[getItemKeyByEntity(item)] = item;
      return map;
    }, {} as Record<string, INewPermissionItemInputByResource>)
  );

  const updateItem = React.useCallback(
    (
      permissionEntityId: string,
      permissionEntityType: AppResourceType,
      action: BasicCRUDActions,
      item: INewPermissionItemInputByResource | null,
      permitted: boolean,
      update: IGrantPermissionActionChange = {}
    ) => {
      const newItems = { ...permissionItems };

      if (!item) {
        // Create new item
        item = {
          permissionEntityId,
          permissionEntityType,
          action,
          isExclusion: false,
        };

        const key = getItemKeyByEntity(item);
        newItems[key] = item;
      } else if (!permitted) {
        // Delete existing permission item
        const key = getItemKeyByEntity(item);
        delete newItems[key];
      } else {
        // Update permission item
        const key = getItemKeyByEntity(item);
        newItems[key] = {
          ...item,
          ...update,
        };
      }

      setPermissionItems(newItems);
    },
    [permissionItems]
  );

  const renderItem = React.useCallback(
    (
      permissionEntityId: string,
      name: string,
      permissionEntityType: AppResourceType
    ) => {
      return (
        <GrantPermissionFormItem
          id={permissionEntityId}
          itemResourceType={itemResourceType}
          permissionOwnerType={permissionOwnerType}
          name={name}
          onChange={(item, action, permitted, update) =>
            updateItem(
              permissionEntityId,
              permissionEntityType,
              action,
              item,
              permitted,
              update
            )
          }
          permissionEntityId={permissionEntityId}
          permissionEntityType={permissionEntityType}
          permissionItems={permissionItems}
          loading={loading}
        />
      );
    },
    [
      permissionItems,
      itemResourceType,
      loading,
      permissionOwnerType,
      updateItem,
    ]
  );

  const renderPreset = React.useCallback(
    (item: IPresetPermissionsGroup) => {
      return renderItem(
        item.resourceId,
        item.name,
        AppResourceType.PresetPermissionsGroup
      );
    },
    [renderItem]
  );

  const renderProgramToken = React.useCallback(
    (item: IProgramAccessToken) => {
      return renderItem(
        item.resourceId,
        item.name,
        AppResourceType.ProgramAccessToken
      );
    },
    [renderItem]
  );

  const renderClientToken = React.useCallback(
    (item: IClientAssignedToken) => {
      return renderItem(
        item.resourceId,
        item.resourceId,
        AppResourceType.ClientAssignedToken
      );
    },
    [renderItem]
  );

  const renderCollaborator = React.useCallback(
    (item: ICollaborator) => {
      return renderItem(
        item.resourceId,
        item.firstName + " " + item.lastName,
        AppResourceType.UserToken
      );
    },
    [renderItem]
  );

  const internalOnSave = React.useCallback(() => {
    onSave(Object.values(permissionItems));
  }, [permissionItems]);

  const tabsNode = (
    <Tabs
      // centered
      animated={false}
      defaultActiveKey={activeKey}
      moreIcon={<RightOutlined />}
      tabBarExtraContent={{
        left: <div style={{ marginLeft: "16px" }} />,
      }}
    >
      <Tabs.TabPane tab={"Permission Groups"} key={TabKey.PermissionGroup}>
        <OrganizationPermissionGroups orgId={orgId} renderItem={renderPreset} />
      </Tabs.TabPane>
      <Tabs.TabPane tab={"Collaborator"} key={TabKey.Collaborator}>
        <OrganizationCollaborators
          orgId={orgId}
          renderItem={renderCollaborator}
        />
      </Tabs.TabPane>
      <Tabs.TabPane tab={"Program Token"} key={TabKey.ProgramToken}>
        <OrganizationProgramTokens
          orgId={orgId}
          renderItem={renderProgramToken}
        />
      </Tabs.TabPane>
      <Tabs.TabPane tab={"Client Token"} key={TabKey.ClientToken}>
        <OrganizationClientTokens
          orgId={orgId}
          renderItem={renderClientToken}
        />
      </Tabs.TabPane>
    </Tabs>
  );

  return (
    <Modal
      visible
      closable={false}
      onOk={internalOnSave}
      onCancel={onCancel}
      okButtonProps={{ disabled: loading }}
      cancelButtonProps={{ disabled: loading }}
      okText="Save"
      cancelText="Close"
    >
      {tabsNode}
    </Modal>
  );
};

export default GrantPermissionForm;
