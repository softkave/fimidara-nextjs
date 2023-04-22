import { RightOutlined } from "@ant-design/icons";
import { css } from "@emotion/css";
import { Collapse, Modal, Tabs } from "antd";
import { omit } from "lodash";
import React from "react";
import { IClientAssignedToken } from "../../../../lib/definitions/clientAssignedToken";
import { IPermissionGroup } from "../../../../lib/definitions/permissionGroups";
import {
  INewPermissionItemInput,
  IPermissionItem,
  PermissionItemAppliesTo,
} from "../../../../lib/definitions/permissionItem";
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
  targetId?: string;
  targetType: AppResourceType;
  containerId: string;
  containerType: AppResourceType;
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

    "& .ant-tabs-nav-wrap": {
      padding: "0px 16px",
    },
  }),
};

const GrantPermissionForm: React.FC<IGrantPermissionFormProps> = (props) => {
  const {
    workspaceId,
    targetId,
    targetType,
    containerType,
    containerId,
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
        containerId,
        containerType,
        targetType,
        appliesTo,
        targetId
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
            targetType={targetType}
            onChange={updateItem}
            permissionEntityId={permissionEntityId}
            permissionEntityType={permissionEntityType}
            loading={loading}
            controller={controller}
          />
        </Collapse.Panel>
      );
    },
    [controller, targetType, loading, updateItem]
  );

  const renderPermissionGroup = React.useCallback(
    (item: IPermissionGroup) => {
      return renderItem(
        item.resourceId,
        item.name,
        AppResourceType.PermissionGroup
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

  const renderPermissionGroupList = React.useCallback(
    (items: IPermissionGroup[]) => {
      return <Collapse>{items.map(renderPermissionGroup)}</Collapse>;
    },
    [renderPermissionGroup]
  );

  const renderProgramTokenList = React.useCallback(
    (items: IProgramAccessToken[]) => {
      return <Collapse>{items.map(renderProgramToken)}</Collapse>;
    },
    [renderProgramToken]
  );

  const renderClientTokenList = React.useCallback(
    (items: IClientAssignedToken[]) => {
      return <Collapse>{items.map(renderClientToken)}</Collapse>;
    },
    [renderClientToken]
  );

  const renderCollaboratorList = React.useCallback(
    (items: ICollaborator[]) => {
      return <Collapse>{items.map(renderCollaborator)}</Collapse>;
    },
    [renderCollaborator]
  );

  const internalOnSave = React.useCallback(() => {
    const newItems = controller
      .getNewItems()
      .map((item) => omit(item, ["resourceId", "isNew"]));
    onSave(newItems, controller.getDeletedItemIds());
  }, [controller, onSave]);

  const tabsNode = (
    <Tabs
      // centered
      animated={false}
      defaultActiveKey={activeKey}
      moreIcon={<RightOutlined />}
    >
      <Tabs.TabPane tab={"Permission Groups"} key={TabKey.PermissionGroup}>
        <WorkspacePermissionGroups
          workspaceId={workspaceId}
          renderList={renderPermissionGroupList}
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
