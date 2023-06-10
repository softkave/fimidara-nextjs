import { FormAlertList } from "@/components/utils/FormAlertList";
import {
  getFolderTypeList,
  getWorkspaceTypeList,
  workspaceResourceTypeLabel,
} from "@/lib/definitions/system";
import {
  clearOutResolvedPermissionFetchStore,
  useMergeMutationHookStates,
  usePermissionsAddMutationHook,
  usePermissionsDeleteMutationHook,
} from "@/lib/hooks/mutationHooks";
import { toArray } from "@/lib/utils/fns";
import { getResourceTypeFromId } from "@/lib/utils/resource";
import { RightOutlined } from "@ant-design/icons";
import { css } from "@emotion/css";
import { Checkbox, Modal, Select, Space, Tabs, message } from "antd";
import {
  AgentToken,
  AppActionType,
  Collaborator,
  DeletePermissionItemInput,
  PermissionGroup,
  PermissionItemInput,
  WorkspaceAppResourceType,
} from "fimidara";
import { first, forEach, isBoolean, isEqual, merge } from "lodash";
import React from "react";
import AgentTokenListContainer from "../agentTokens/AgentTokenListContainer";
import CollaboratorListContainer from "../collaborators/CollaboratorListContainer";
import PermissionGroupListContainer from "../permissionGroups/PermissionGroupListContainer";
import TargetGrantPermissionFormEntityList, {
  splitKey,
} from "./TargetGrantPermissionFormEntityList";
import {
  ResolvedPermissionsMap,
  TargetIdPermissions,
  TargetTypePermissions,
} from "./types";

export interface TargetGrantPermissionFormProps {
  workspaceId: string;
  targetId: string;
  forTargetTypeOnly?: WorkspaceAppResourceType | WorkspaceAppResourceType[];
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

    "& .ant-tabs-nav-wrap": {
      marginBottom: "16px",
      borderBottom: "1px solid #f0f0f0",
      // padding: "0px 16px",
    },
  }),
  targetTypeRoot: css({ display: "flex" }),
  targetTypeToggle: css({ flex: 1, display: "flex", alignItems: "center" }),
};

const TargetGrantPermissionForm: React.FC<TargetGrantPermissionFormProps> = (
  props
) => {
  const { workspaceId, targetId, forTargetTypeOnly, onClose } = props;

  const [activeKey] = React.useState(TabKey.PermissionGroup);
  const [targetType, setTargetType] = React.useState<
    WorkspaceAppResourceType | undefined
  >(forTargetTypeOnly ? first(toArray(forTargetTypeOnly)) : undefined);
  const [targetIdPermissions, setTargetIdPermissions] =
    React.useState<TargetIdPermissions>({ original: {}, updated: {} });
  const [targetTypePermissions, setTargetTypePermissions] =
    React.useState<TargetTypePermissions>({});

  const handleTargetIdPermissionsOnChange = (
    updated: ResolvedPermissionsMap,
    original: ResolvedPermissionsMap
  ) => {
    const newPermissions = merge({}, targetIdPermissions, {
      original,
      updated,
    });
    setTargetIdPermissions(newPermissions);
  };
  const handleTargetTypePermissionsOnChange = (
    updated: ResolvedPermissionsMap,
    original: ResolvedPermissionsMap
  ) => {
    if (!targetType) return;

    const newPermissions = merge({}, targetTypePermissions, {
      [targetType]: { original, updated },
    });
    setTargetTypePermissions(newPermissions);
  };
  const handleOnChange = (
    updated: ResolvedPermissionsMap,
    original: ResolvedPermissionsMap
  ) => {
    if (targetType) {
      handleTargetTypePermissionsOnChange(updated, original);
    } else {
      handleTargetIdPermissionsOnChange(updated, original);
    }
  };

  const addHook = usePermissionsAddMutationHook();
  const deleteHook = usePermissionsDeleteMutationHook();
  const { loading, error } = useMergeMutationHookStates(addHook, deleteHook);

  const handleOnSave = async () => {
    const { addItems, deleteItems } = getAddedAndDeletedPermissions(
      targetId,
      targetIdPermissions,
      targetTypePermissions
    );

    await Promise.all([
      addItems.length &&
        addHook.runAsync({ body: { workspaceId, items: addItems } }),
      deleteItems &&
        deleteHook.runAsync({ body: { workspaceId, items: deleteItems } }),
    ]);

    if (addItems.length || deleteItems.length) {
      message.success(`Permissions updated.`);
    }

    // Close first, to prevent a refetch of resolved permissions in this
    // session/modal Assuming once the user saves, we're already done with
    // permission updates.
    onClose();

    // Forces a refetch of resolved permissions. Resolved permission params are
    // quite complex so it's easier just to clear out and refetch.
    clearOutResolvedPermissionFetchStore();
  };

  const defaultUpdatedPermissions = targetType
    ? targetTypePermissions[targetType]?.updated ?? {}
    : targetIdPermissions.updated;

  const renderPermissionGroupList = (items: PermissionGroup[]) => {
    return (
      <TargetGrantPermissionFormEntityList
        key={targetType}
        workspaceId={workspaceId}
        items={items}
        targetId={targetId}
        targetType={targetType}
        disabled={loading}
        defaultUpdatedPermissions={defaultUpdatedPermissions}
        getInfoFromItem={(item) => ({ name: item.name })}
        onChange={handleOnChange}
      />
    );
  };
  const renderAgentTokenList = (items: AgentToken[]) => {
    return (
      <TargetGrantPermissionFormEntityList
        key={targetType}
        workspaceId={workspaceId}
        items={items}
        targetId={targetId}
        targetType={targetType}
        disabled={loading}
        defaultUpdatedPermissions={defaultUpdatedPermissions}
        getInfoFromItem={(item) => ({ name: item.name ?? item.resourceId })}
        onChange={handleOnChange}
      />
    );
  };
  const renderCollaboratorList = (items: Collaborator[]) => {
    return (
      <TargetGrantPermissionFormEntityList
        key={targetType}
        workspaceId={workspaceId}
        items={items}
        targetId={targetId}
        targetType={targetType}
        disabled={loading}
        defaultUpdatedPermissions={defaultUpdatedPermissions}
        getInfoFromItem={(item) => ({
          name: item.firstName + " " + item.lastName,
        })}
        onChange={handleOnChange}
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
  const targetIdTargetType = getResourceTypeFromId(targetId);

  if (targetIdTargetType === "workspace" || targetIdTargetType === "folder") {
    let childrenTypes: WorkspaceAppResourceType[] = [];

    if (forTargetTypeOnly) {
      childrenTypes = toArray(forTargetTypeOnly);
    } else {
      childrenTypes =
        targetIdTargetType === "workspace"
          ? getWorkspaceTypeList()
          : targetIdTargetType === "folder"
          ? getFolderTypeList()
          : [];
    }

    targetTypeNode = (
      <div className={classes.targetTypeRoot}>
        <div className={classes.targetTypeToggle}>
          <Checkbox
            checked={!!targetType}
            disabled={loading || !!forTargetTypeOnly}
            onChange={(evt) => {
              if (evt.target.checked) {
                setTargetType("file");
              } else {
                setTargetType(undefined);
              }
            }}
          >
            Set children permissions
          </Checkbox>
        </div>
        <Select
          disabled={!targetType || loading}
          value={targetType}
          style={{ minWidth: 180 }}
          onChange={(v, opt) => {
            setTargetType(v);
          }}
          options={childrenTypes.map((type) => ({
            value: type,
            label: workspaceResourceTypeLabel[type],
          }))}
        />
      </div>
    );
  }

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
    if (!isBoolean(updatedPermitted.permitted)) return;

    // No need to update if permission is same and access entity is same as
    // entity
    if (
      originalPermitted &&
      originalPermitted.permitted === updatedPermitted.permitted &&
      originalPermitted.accessEntityId === entityId
    )
      return;

    deleteItems.push({
      action: [action as AppActionType],
      entity: { entityId: [entityId] },
      target: [{ targetId: [targetId] }],

      // Delete opposite of permission
      grantAccess: [!updatedPermitted.permitted],
      appliesTo: ["self"],
    });
    addItems.push({
      action: [action as AppActionType],
      entity: { entityId: [entityId] },
      target: [{ targetId: [targetId] }],
      grantAccess: updatedPermitted.permitted,
      appliesTo: ["self"],
    });
  });

  return { addItems, deleteItems };
}
function getAddedAndDeletedTargetTypePermissions(
  targetId: string,
  targetType: WorkspaceAppResourceType,
  targetTypePermissions: TargetIdPermissions
) {
  const { original, updated } = targetTypePermissions;
  const addItems: Array<PermissionItemInput> = [];
  const deleteItems: Array<DeletePermissionItemInput> = [];

  forEach(updated, (updatedPermitted, key) => {
    const [entityId, action] = splitKey(key);
    const originalPermitted = original[key];

    // No need to update if permission is same and access entity is same as
    // entity
    if (
      originalPermitted &&
      isEqual(originalPermitted.permitted, updatedPermitted.permitted) &&
      originalPermitted.accessEntityId === entityId
    ) {
      return;
    }

    deleteItems.push({
      action: [action as AppActionType],
      entity: { entityId: [entityId] },
      target: [{ targetId: [targetId], targetType: [targetType] }],

      // Delete opposite of permission
      grantAccess: [!updatedPermitted.permitted],
      appliesTo: ["children"],
    });
    addItems.push({
      action: [action as AppActionType],
      entity: { entityId: [entityId] },
      target: [{ targetId: [targetId], targetType: [targetType] }],
      grantAccess: updatedPermitted.permitted,
      appliesTo: ["children"],
    });
  });

  return { addItems, deleteItems };
}
function getAddedAndDeletedPermissions(
  targetId: string,
  targetIdPermissions: TargetIdPermissions,
  targetTypePermissions: TargetTypePermissions
) {
  let { addItems, deleteItems } = getAddedAndDeletedTargetIdPermissions(
    targetId,
    targetIdPermissions
  );

  for (const targetType in targetTypePermissions) {
    const tType = getAddedAndDeletedTargetTypePermissions(
      targetId,
      targetType as WorkspaceAppResourceType,
      targetTypePermissions[targetType]
    );
    addItems = addItems.concat(tType.addItems);
    deleteItems = deleteItems.concat(tType.deleteItems);
  }

  return { addItems, deleteItems };
}

export default TargetGrantPermissionForm;
