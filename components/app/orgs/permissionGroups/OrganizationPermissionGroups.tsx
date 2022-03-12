import { Space } from "antd";
import React from "react";
import { IOrganization } from "../../../../lib/definitions/organization";
import { appOrgPaths } from "../../../../lib/definitions/system";
import useOrgPermissionGroupList from "../../../../lib/hooks/orgs/useOrgPermissionGroupList";
import ListHeader from "../../../utils/ListHeader";
import PageError from "../../../utils/PageError";
import PageLoading from "../../../utils/PageLoading";
import PageNothingFound from "../../../utils/PageNothingFound";
import { appClasses } from "../../../utils/theme";
import PermissionGroupList from "./PermissionGroupList";

export interface IOrganizationPermissionGroupsProps {
  org: IOrganization;
}

const OrganizationPermissionGroups: React.FC<
  IOrganizationPermissionGroupsProps
> = (props) => {
  const { org } = props;
  const { data, error, isLoading } = useOrgPermissionGroupList(org.resourceId);
  let content: React.ReactNode = null;

  if (isLoading || !data) {
    content = <PageLoading messageText="Loading preset permission groups..." />;
  } else if (error) {
    content = (
      <PageError
        className={appClasses.main}
        messageText={
          error?.message || "Error fetching preset permission groups"
        }
      />
    );
  } else if (data.presets.length === 0) {
    content = (
      <PageNothingFound
        className={appClasses.maxWidth420}
        messageText="No permission groups yet. Create one using the plus button above."
      />
    );
  } else {
    content = (
      <PermissionGroupList orgId={org.resourceId} presets={data.presets} />
    );
  }

  return (
    <Space
      direction="vertical"
      style={{ width: "100%", padding: "16px" }}
      size="large"
    >
      <ListHeader
        title="Preset Permission Groups"
        formLinkPath={appOrgPaths.createPermissionGroupForm(org.resourceId)}
      />
      {content}
    </Space>
  );
};

export default OrganizationPermissionGroups;