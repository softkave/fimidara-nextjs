import { RightOutlined } from "@ant-design/icons";
import { css } from "@emotion/css";
import { Collapse, Modal, Tabs } from "antd";
import { omit } from "lodash";
import React from "react";
import { IClientAssignedToken } from "../../../../lib/definitions/clientAssignedToken";
import {
  INewPermissionItemInput,
  IPermissionItem,
  PermissionItemAppliesTo,
} from "../../../../lib/definitions/permissionItem";
import { IPresetPermissionsGroup } from "../../../../lib/definitions/presets";
import { IProgramAccessToken } from "../../../../lib/definitions/programAccessToken";
import {
  AppResourceType,
  BasicCRUDActions,
} from "../../../../lib/definitions/system";
import { ICollaborator } from "../../../../lib/definitions/user";
import WorkspaceClientTokens from "../clientTokens/WorkspaceClientTokens";
import WorkspaceCollaborators from "../collaborators/WorkspaceCollaborators";
import WorkspacePermissionGroups from "../permissionGroups/WorkspacePermissionGroups";
import WorkspaceProgramTokens from "../programTokens/WorkspaceProgramTokens";
import GrantPermissionFormItem from "./GrantPermissionFormItem";
import PermissionItemsByResourceController from "./PermissionItemsController";

export interface IGrantPermissionFormProps {
  loading?: boolean;
  workspaceId: string;
  itemResourceId?: string;
  itemResourceType: AppResourceType;
  permissionOwnerId: string;
  permissionOwnerType: AppResourceType;
  existingPermissionItems: IPermissionItem[];
  appliesTo: PermissionItemAppliesTo;
  onSave: (
    newItems: INewPermissionItemInput[],
    deletedItemIds: string[]
  ) => void;
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
    workspaceId,
    itemResourceId,
    itemResourceType,
    permissionOwnerType,
    permissionOwnerId,
    existingPermissionItems,
    loading,
    appliesTo,
    onSave,
    onCancel,
  } = props;

  const [activeKey] = React.useState(TabKey.PermissionGroup);
  const [controller, setController] =
    React.useState<PermissionItemsByResourceController>(() =>
      PermissionItemsByResourceController.fromPermissionItems(
        existingPermissionItems,
        permissionOwnerId,
        permissionOwnerType,
        itemResourceType,
        appliesTo,
        itemResourceId
      )
    );

  const updateItem = React.useCallback(
    (
      permissionEntityId: string,
      permissionEntityType: AppResourceType,
      action: BasicCRUDActions,
      permitted: boolean
    ) => {
      const newController = controller.togglePermission(
        permissionEntityId,
        permissionEntityType,
        action,
        permitted
      );

      setController(newController);
    },
    [controller]
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
            onChange={updateItem}
            permissionEntityId={permissionEntityId}
            permissionEntityType={permissionEntityType}
            loading={loading}
            controller={controller}
          />
        </Collapse.Panel>
      );
    },
    [controller, itemResourceType, loading, updateItem]
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
    const newItems = controller
      .getNewItems()
      .map((item) => omit(item, ["resourceId", "isNew"]));
    onSave(newItems, controller.getDeletedItemIds());
  }, [controller]);

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
        <WorkspacePermissionGroups
          workspaceId={workspaceId}
          renderList={renderPresetList}
          menu={null}
        />
      </Tabs.TabPane>
      <Tabs.TabPane tab={"Collaborator"} key={TabKey.Collaborator}>
        <WorkspaceCollaborators
          workspaceId={workspaceId}
          renderList={renderCollaboratorList}
          menu={null}
        />
      </Tabs.TabPane>
      <Tabs.TabPane tab={"Program Token"} key={TabKey.ProgramToken}>
        <WorkspaceProgramTokens
          workspaceId={workspaceId}
          renderList={renderProgramTokenList}
          menu={null}
        />
      </Tabs.TabPane>
      <Tabs.TabPane tab={"Client Token"} key={TabKey.ClientToken}>
        <WorkspaceClientTokens
          workspaceId={workspaceId}
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
