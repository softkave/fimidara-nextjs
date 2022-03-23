import { Space } from "antd";
import React from "react";
import { IPresetPermissionsGroup } from "../../../../lib/definitions/presets";
import {
  appOrgPaths,
  AppResourceType,
} from "../../../../lib/definitions/system";
import useOrgPermissionGroupList from "../../../../lib/hooks/orgs/useOrgPermissionGroupList";
import { getBaseError } from "../../../../lib/utilities/errors";
import ListHeader from "../../../utils/ListHeader";
import PageError from "../../../utils/PageError";
import PageLoading from "../../../utils/PageLoading";
import PageNothingFound from "../../../utils/PageNothingFound";
import { appClasses } from "../../../utils/theme";
import GrantPermissionMenu from "../permissionItems/GrantPermissionMenu";
import PermissionGroupList from "./PermissionGroupList";

export interface IOrganizationPermissionGroupsProps {
  orgId: string;
  renderItem?: (item: IPresetPermissionsGroup) => React.ReactNode;
  renderList?: (items: IPresetPermissionsGroup[]) => React.ReactNode;
  renderRoot?: (node: React.ReactNode) => React.ReactElement;
}

const OrganizationPermissionGroups: React.FC<
  IOrganizationPermissionGroupsProps
> = (props) => {
  const { orgId, renderItem, renderList, renderRoot } = props;
  const { data, error, isLoading } = useOrgPermissionGroupList(orgId);
  let content: React.ReactNode = null;

  if (error) {
    content = (
      <PageError
        className={appClasses.main}
        messageText={
          getBaseError(error) || "Error fetching preset permission groups"
        }
      />
    );
  } else if (isLoading || !data) {
    content = <PageLoading messageText="Loading preset permission groups..." />;
  } else if (data.presets.length === 0) {
    content = (
      <PageNothingFound
        className={appClasses.maxWidth420}
        messageText="No permission groups yet. Create one using the plus button above."
      />
    );
  } else {
    content = renderList ? (
      renderList(data.presets)
    ) : (
      <PermissionGroupList
        orgId={orgId}
        presets={data.presets}
        renderItem={renderItem}
      />
    );
  }

  if (renderRoot) {
    return renderRoot(content);
  }

  return (
    <div className={appClasses.main}>
      <Space direction="vertical" style={{ width: "100%" }} size="large">
        <ListHeader
          title="Preset Permission Groups"
          formLinkPath={appOrgPaths.createPermissionGroupForm(orgId)}
          actions={
            <GrantPermissionMenu
              orgId={orgId}
              itemResourceType={AppResourceType.PresetPermissionsGroup}
              permissionOwnerId={orgId}
              permissionOwnerType={AppResourceType.Organization}
            />
          }
        />
        {content}
      </Space>
    </div>
  );
};

export default OrganizationPermissionGroups;
