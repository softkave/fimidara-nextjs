import { Space } from "antd";
import React from "react";
import { IOrganization } from "../../../../lib/definitions/organization";
import { appOrgPaths } from "../../../../lib/definitions/system";
import useOrgCollaboratorList from "../../../../lib/hooks/orgs/useOrgCollaboratorList";
import ListHeader from "../../../utils/ListHeader";
import PageError from "../../../utils/PageError";
import PageLoading from "../../../utils/PageLoading";
import PageNothingFound from "../../../utils/PageNothingFound";
import { appClasses } from "../../../utils/theme";
import CollaboratorList from "./CollaboratorList";

export interface IOrganizationCollaboratorsProps {
  org: IOrganization;
}

const OrganizationCollaborators: React.FC<IOrganizationCollaboratorsProps> = (
  props
) => {
  const { org } = props;
  const { data, error, isLoading } = useOrgCollaboratorList(org.resourceId);
  let content: React.ReactNode = null;

  if (isLoading || !data) {
    content = <PageLoading messageText="Loading collaborators..." />;
  } else if (error) {
    content = (
      <PageError
        className={appClasses.main}
        messageText={error?.message || "Error fetching collaborators"}
      />
    );
  } else if (data.collaborators.length === 0) {
    content = (
      <PageNothingFound
        className={appClasses.maxWidth420}
        messageText="No collaborators yet. Create one using the plus button above."
      />
    );
  } else {
    content = (
      <CollaboratorList
        orgId={org.resourceId}
        collaborators={data.collaborators}
      />
    );
  }

  return (
    <Space
      direction="vertical"
      style={{ width: "100%", padding: "16px" }}
      size="large"
    >
      <ListHeader
        title="Collaborators"
        formLinkPath={appOrgPaths.createRequestForm(org.resourceId)}
      />
      {content}
    </Space>
  );
};

export default OrganizationCollaborators;
