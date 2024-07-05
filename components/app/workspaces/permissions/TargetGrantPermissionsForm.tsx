import { FormAlertList } from "@/components/utils/FormAlertList";
import {
  clearOutResolvedPermissionFetchStore,
  useMergeMutationHookStates,
  usePermissionsAddMutationHook,
  usePermissionsDeleteMutationHook,
} from "@/lib/hooks/mutationHooks";
import { RightOutlined } from "@ant-design/icons";
import { css } from "@emotion/css";
import { Modal, Space, Tabs, message } from "antd";
import {
  AgentToken,
  Collaborator,
  DeletePermissionItemInput,
  FimidaraPermissionAction,
  FimidaraResourceType,
  PermissionGroup,
  PermissionItemInput,
} from "fimidara";
import { forEach, isBoolean, merge } from "lodash";
import React from "react";
import AgentTokenListContainer from "../agentTokens/AgentTokenListContainer";
import CollaboratorListContainer from "../collaborators/CollaboratorListContainer";
import PermissionGroupListContainer from "../permissionGroups/PermissionGroupListContainer";
import TargetGrantPermissionFormEntityList, {
  splitKey,
} from "./TargetGrantPermissionFormEntityList";
import { ResolvedPermissionsMap, TargetIdPermissions } from "./types";

export interface TargetGrantPermissionFormProps {
  workspaceId: string;
  targetId: string;
  targetType: FimidaraResourceType;
  onClose: () => void;
}

enum TabKey {
  Collaborator = "collaborator",
  AgentToken = "agent-token",
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
    "& .ant-tabs-nav::before": {
      border: 0,
    },
    "& .ant-tabs-nav-wrap": {
      marginBottom: "16px",
      borderBottom: "1px solid #f0f0f0",
    },
  }),
  targetTypeRoot: css({
    display: "flex",
    "@media (max-width: 600px)": {
      display: "block",
    },
  }),
  targetTypeToggle: css({
    flex: 1,
    display: "flex",
    alignItems: "center",
    "@media (max-width: 600px)": {
      marginBottom: "16px",
    },
  }),
};

const TargetGrantPermissionForm: React.FC<TargetGrantPermissionFormProps> = (
  props
) => {
  const { workspaceId, targetId, targetType, onClose } = props;

  const [activeKey] = React.useState(TabKey.PermissionGroup);
  const [targetPermissions, setTargetPermissions] =
    React.useState<TargetIdPermissions>({ original: {}, updated: {} });

  const handleTargetPermissionsOnChange = (
    updated: ResolvedPermissionsMap,
    original: ResolvedPermissionsMap
  ) => {
    const newPermissions = merge({}, targetPermissions, {
      original,
      updated,
    });
    setTargetPermissions(newPermissions);
  };

  const addHook = usePermissionsAddMutationHook();
  const deleteHook = usePermissionsDeleteMutationHook();
  const { loading, error } = useMergeMutationHookStates(addHook, deleteHook);

  const handleOnSave = async () => {
    const { addItems, deleteItems } = getAddedAndDeletedPermissions(
      targetId,
      targetPermissions
    );

    await Promise.all([
      addItems.length &&
        addHook.runAsync({ body: { workspaceId, items: addItems } }),
      deleteItems &&
        deleteHook.runAsync({ body: { workspaceId, items: deleteItems } }),
    ]);

    if (addItems.length || deleteItems.length) {
      message.success(`Permissions updated`);
    }

    // Close first, to prevent a refetch of resolved permissions in this
    // session/modal Assuming once the user saves, we're already done with
    // permission updates.
    onClose();

    // Forces a refetch of resolved permissions. Resolved permission params are
    // quite complex so it's easier just to clear out and refetch.
    clearOutResolvedPermissionFetchStore();
  };

  const renderPermissionGroupList = (items: PermissionGroup[]) => {
    return (
      <TargetGrantPermissionFormEntityList
        key={targetType}
        workspaceId={workspaceId}
        entities={items}
        targetId={targetId}
        targetType={targetType}
        disabled={loading}
        defaultUpdatedPermissions={targetPermissions.updated}
        getInfoFromItem={(item) => ({ name: item.name })}
        onChange={handleTargetPermissionsOnChange}
      />
    );
  };

  const renderAgentTokenList = (items: AgentToken[]) => {
    return (
      <TargetGrantPermissionFormEntityList
        key={targetType}
        workspaceId={workspaceId}
        entities={items}
        targetId={targetId}
        targetType={targetType}
        disabled={loading}
        defaultUpdatedPermissions={targetPermissions.updated}
        getInfoFromItem={(item) => ({ name: item.name ?? item.resourceId })}
        onChange={handleTargetPermissionsOnChange}
      />
    );
  };

  const renderCollaboratorList = (items: Collaborator[]) => {
    return (
      <TargetGrantPermissionFormEntityList
        key={targetType}
        workspaceId={workspaceId}
        entities={items}
        targetId={targetId}
        targetType={targetType}
        disabled={loading}
        defaultUpdatedPermissions={targetPermissions.updated}
        getInfoFromItem={(item) => ({
          name: item.firstName + " " + item.lastName,
        })}
        onChange={handleTargetPermissionsOnChange}
      />
    );
  };

  const tabsNode = (
    <Tabs defaultActiveKey={activeKey} moreIcon={<RightOutlined />}>
      <Tabs.TabPane tab={"Permission Group"} key={TabKey.PermissionGroup}>
        <PermissionGroupListContainer
          workspaceId={workspaceId}
          renderList={renderPermissionGroupList}
        />
      </Tabs.TabPane>
      <Tabs.TabPane tab={"Collaborator"} key={TabKey.Collaborator}>
        <CollaboratorListContainer
          workspaceId={workspaceId}
          renderList={renderCollaboratorList}
        />
      </Tabs.TabPane>
      <Tabs.TabPane tab={"Agent Token"} key={TabKey.AgentToken}>
        <AgentTokenListContainer
          workspaceId={workspaceId}
          renderList={renderAgentTokenList}
        />
      </Tabs.TabPane>
    </Tabs>
  );

  let targetTypeNode: React.ReactNode = null;
  const errorNode = error.length ? <FormAlertList error={error} /> : null;
  const windowWidth = window ? window.document.body.clientWidth : undefined;
  const maxWidth = 520;
  const modalWidth = windowWidth
    ? windowWidth < maxWidth
      ? windowWidth
      : maxWidth
    : maxWidth;

  return (
    <Modal
      open
      destroyOnClose
      closable={false}
      width={modalWidth}
      onOk={handleOnSave}
      onCancel={onClose}
      okButtonProps={{ disabled: loading }}
      cancelButtonProps={{ danger: true, disabled: loading }}
      okText="Save Permissions"
      cancelText="Close"
      className={classes.root}
    >
      <Space direction="vertical" style={{ width: "100%" }}>
        {errorNode}
        {targetTypeNode}
        {tabsNode}
      </Space>
    </Modal>
  );
};

function getAddedAndDeletedTargetIdPermissions(
  targetId: string,
  targetIdPermissions: TargetIdPermissions
) {
  const { original, updated } = targetIdPermissions;
  const addItems: Array<PermissionItemInput> = [];
  const deleteItems: Array<DeletePermissionItemInput> = [];

  forEach(updated, (updatedPermitted, key) => {
    const [entityId, action] = splitKey(key);
    const originalPermitted = original[key];

    // Target ID permitted is always boolean
    if (!isBoolean(updatedPermitted?.access)) return;

    // No need to update if permission is same and access entity is same as
    // entity
    if (
      originalPermitted &&
      originalPermitted.access === updatedPermitted.access &&
      originalPermitted.entityId === entityId
    )
      return;

    deleteItems.push({
      entityId,
      action: action as FimidaraPermissionAction,
      target: { targetId },

      // Delete opposite of permission
      access: !updatedPermitted.access,
    });
    addItems.push({
      entityId,
      action: action as FimidaraPermissionAction,
      target: { targetId },
      access: updatedPermitted.access,
    });
  });

  return { addItems, deleteItems };
}

function getAddedAndDeletedPermissions(
  targetId: string,
  targetIdPermissions: TargetIdPermissions
) {
  const { addItems, deleteItems } = getAddedAndDeletedTargetIdPermissions(
    targetId,
    targetIdPermissions
  );

  return { addItems, deleteItems };
}

export default TargetGrantPermissionForm;
