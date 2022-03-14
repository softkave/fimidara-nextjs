import { Space } from "antd";
import React from "react";
import { appOrgPaths } from "../../../../lib/definitions/system";
import useOrgCollaboratorList from "../../../../lib/hooks/orgs/useOrgCollaboratorList";
import ListHeader from "../../../utils/ListHeader";
import PageError from "../../../utils/PageError";
import PageLoading from "../../../utils/PageLoading";
import PageNothingFound from "../../../utils/PageNothingFound";
import { appClasses } from "../../../utils/theme";
import CollaboratorList from "./CollaboratorList";

export interface IOrganizationCollaboratorsProps {
  orgId: string;
}

const OrganizationCollaborators: React.FC<IOrganizationCollaboratorsProps> = (
  props
) => {
  const { orgId } = props;
  const { data, error, isLoading } = useOrgCollaboratorList(orgId);
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
      <CollaboratorList orgId={orgId} collaborators={data.collaborators} />
    );
  }

  return (
    <div className={appClasses.main}>
      <Space direction="vertical" style={{ width: "100%" }} size="large">
        <ListHeader
          title="Collaborators"
          formLinkPath={appOrgPaths.createRequestForm(orgId)}
        />
        {content}
      </Space>
    </div>
  );
};

export default OrganizationCollaborators;
