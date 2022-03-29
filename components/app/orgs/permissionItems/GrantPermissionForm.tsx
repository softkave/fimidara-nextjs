import { RightOutlined } from "@ant-design/icons";
import { css } from "@emotion/css";
import { Collapse, Modal, Tabs } from "antd";
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
  permissionOwnerId: string;
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

const classes = {
  root: css({
    "& .ant-modal-body": {
      padding: 0,
    },

    "& .ant-tabs-nav": {
      marginBottom: 0,
    },
  }),
};

const GrantPermissionForm: React.FC<IGrantPermissionFormProps> = (props) => {
  const {
    orgId,
    itemResourceType,
    permissionOwnerType,
    permissionOwnerId,
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
      const item: INewPermissionItemInputByResource = {
        permissionEntityId: itemInput.permissionEntityId,
        permissionEntityType: itemInput.permissionEntityType,
        action: itemInput.action,
        isExclusion: itemInput.isExclusion,
        isForPermissionOwnerOnly: itemInput.isForPermissionOwnerOnly,
        permissionOwnerId: itemInput.permissionOwnerId,
        permissionOwnerType: itemInput.permissionOwnerType,
        isWildcardResourceType:
          itemInput.itemResourceType === AppResourceType.All,
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
      let newItems = { ...permissionItems };

      if (!item) {
        // Create new item
        item = {
          permissionEntityId,
          permissionEntityType,
          permissionOwnerId,
          permissionOwnerType,
          action,
          isExclusion: false,
        };

        const key = getItemKeyByEntity(item);
        newItems[key] = item;
      } else if (!permitted) {
        // Delete existing permission item for entity
        newItems = Object.values(newItems).reduce((map, item) => {
          if (
            item.permissionEntityId !== permissionEntityId &&
            item.permissionEntityType !== permissionEntityType
          ) {
            map[getItemKeyByEntity(item)] = item;
          }

          return map;
        }, {} as Record<string, INewPermissionItemInputByResource>);
      } else {
        // Update permission item
        // do nothing, we don't need it yet
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
        <Collapse.Panel key={permissionEntityId} header={name}>
          <GrantPermissionFormItem
            key={permissionEntityId}
            itemResourceType={itemResourceType}
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
        </Collapse.Panel>
      );
    },
    [permissionItems, itemResourceType, loading, updateItem]
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

  const renderPresetList = React.useCallback(
    (items: IPresetPermissionsGroup[]) => {
      return <Collapse>{items.map(renderPreset)}</Collapse>;
    },
    [renderItem]
  );

  const renderProgramTokenList = React.useCallback(
    (items: IProgramAccessToken[]) => {
      return <Collapse>{items.map(renderProgramToken)}</Collapse>;
    },
    [renderItem]
  );

  const renderClientTokenList = React.useCallback(
    (items: IClientAssignedToken[]) => {
      return <Collapse>{items.map(renderClientToken)}</Collapse>;
    },
    [renderItem]
  );

  const renderCollaboratorList = React.useCallback(
    (items: ICollaborator[]) => {
      return <Collapse>{items.map(renderCollaborator)}</Collapse>;
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
        <OrganizationPermissionGroups
          orgId={orgId}
          renderList={renderPresetList}
          menu={null}
        />
      </Tabs.TabPane>
      <Tabs.TabPane tab={"Collaborator"} key={TabKey.Collaborator}>
        <OrganizationCollaborators
          orgId={orgId}
          renderList={renderCollaboratorList}
          menu={null}
        />
      </Tabs.TabPane>
      <Tabs.TabPane tab={"Program Token"} key={TabKey.ProgramToken}>
        <OrganizationProgramTokens
          orgId={orgId}
          renderList={renderProgramTokenList}
          menu={null}
        />
      </Tabs.TabPane>
      <Tabs.TabPane tab={"Client Token"} key={TabKey.ClientToken}>
        <OrganizationClientTokens
          orgId={orgId}
          renderList={renderClientTokenList}
          menu={null}
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
      className={classes.root}
    >
      {tabsNode}
    </Modal>
  );
};

export default GrantPermissionForm;
