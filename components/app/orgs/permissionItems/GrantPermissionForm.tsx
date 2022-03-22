import { RightOutlined } from "@ant-design/icons";
import { Collapse, Tabs } from "antd";
import React from "react";
import { IClientAssignedToken } from "../../../../lib/definitions/clientAssignedToken";
import { INewPermissionItemInput } from "../../../../lib/definitions/permissionItem";
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
import GrantPermissionAction, {
  IGrantPermissionActionChange,
} from "./GrantPermissionAction";

export interface IGrantPermissionFormProps {
  orgId: string;
  permissionOwnerId: string;
  permissionOwnerType: AppResourceType;
  itemResourceId?: string;
  itemResourceType: AppResourceType;
}

enum TabKey {
  Collaborator = "collaborator",
  ProgramToken = "program-token",
  ClientToken = "client-token",
  PermissionGroup = "permission-group",
}

interface IGrantPermissionFormItemInput extends INewPermissionItemInput {
  permissionEntityId: string;
  permissionEntityType: AppResourceType;
}

function getItemKey(item: {
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

const GrantPermissionForm: React.FC<IGrantPermissionFormProps> = (props) => {
  const {
    orgId,
    permissionOwnerId,
    permissionOwnerType,
    itemResourceType,
    itemResourceId,
  } = props;
  const [activeKey] = React.useState(TabKey.PermissionGroup);
  const [permissionItems, setPermissionItems] = React.useState<
    Record<string, IGrantPermissionFormItemInput>
  >({});

  const updateItem = React.useCallback(
    (
      permissionEntityId: string,
      permissionEntityType: AppResourceType,
      action: BasicCRUDActions,
      item: IGrantPermissionFormItemInput | null,
      permitted: boolean,
      update: IGrantPermissionActionChange = {}
    ) => {
      const newItems = { ...permissionItems };

      if (!item) {
        // Create new item
        item = {
          permissionEntityId,
          permissionEntityType,
          permissionOwnerId,
          permissionOwnerType,
          itemResourceId,
          itemResourceType,
          action,
          isExclusion: false,
        };

        const key = getItemKey(item);
        newItems[key] = item;
      } else if (!permitted) {
        // Delete existing permission item
        const key = getItemKey(item);
        delete newItems[key];
      } else {
        // Update permission item
        const key = getItemKey(item);
        newItems[key] = {
          ...item,
          ...update,
        };
      }

      setPermissionItems(newItems);
    },
    [
      permissionOwnerId,
      permissionOwnerType,
      itemResourceId,
      itemResourceType,
      permissionItems,
    ]
  );

  const renderItem = React.useCallback(
    (
      permissionEntityId: string,
      name: string,
      permissionEntityType: AppResourceType
    ) => {
      return (
        <Collapse.Panel key={permissionEntityId} header={name}>
          {Object.values(BasicCRUDActions).map((action) => {
            const item =
              permissionItems[
                getItemKey({ permissionEntityId, permissionEntityType, action })
              ];

            return (
              <GrantPermissionAction
                label={action}
                onChange={(permitted, update) =>
                  updateItem(
                    permissionEntityId,
                    permissionEntityType,
                    action,
                    item,
                    permitted,
                    update
                  )
                }
                hasChildren={itemResourceType === AppResourceType.Folder}
                isForOwner={item?.isForPermissionOwnerOnly}
                permitted={!!item && !item.isExclusion}
              />
            );
          })}
        </Collapse.Panel>
      );
    },
    [permissionItems, updateItem]
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

  return (
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
};

export default GrantPermissionForm;
