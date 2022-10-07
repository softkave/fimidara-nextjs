import { GetServerSideProps } from "next";
import React from "react";
import PermissionGroupForm from "../../../../../../components/app/workspaces/permissionGroups/PermissionGroupForm";
import Workspace from "../../../../../../components/app/workspaces/Workspace";
import withPageAuthRequiredHOC from "../../../../../../components/hoc/withPageAuthRequired";
import PageError from "../../../../../../components/utils/PageError";
import PageLoading from "../../../../../../components/utils/PageLoading";
import { appWorkspacePaths } from "../../../../../../lib/definitions/system";
import usePermissionGroup from "../../../../../../lib/hooks/workspaces/usePermissionGroup";
import { getBaseError } from "../../../../../../lib/utilities/errors";

export type IWorkspacePermissionGroupFormPageProps = {
  workspaceId: string;
  permissionGroupId: string;
};

const WorkspacePermissionGroupFormPage: React.FC<
  IWorkspacePermissionGroupFormPageProps
> = (props) => {
  const { workspaceId, permissionGroupId } = props;
  const { error, isLoading, data } = usePermissionGroup(permissionGroupId);
  let content: React.ReactNode = null;

  if (error) {
    content = (
      <PageError
        messageText={getBaseError(error) || "Error fetching permission group"}
      />
    );
  } else if (isLoading || !data) {
    content = <PageLoading messageText="Loading permission group..." />;
  } else {
    content = (
      <PermissionGroupForm
        workspaceId={data.permissionGroup.workspaceId}
        permissionGroup={data.permissionGroup}
      />
    );
  }

  return (
    <Workspace
      workspaceId={workspaceId}
      activeKey={appWorkspacePaths.permissionGroupList(workspaceId)}
    >
      {content}
    </Workspace>
  );
};

export default withPageAuthRequiredHOC(WorkspacePermissionGroupFormPage);

export const getServerSideProps: GetServerSideProps<
  IWorkspacePermissionGroupFormPageProps,
  IWorkspacePermissionGroupFormPageProps
> = async (context) => {
  return {
    props: {
      workspaceId: context.params!.workspaceId,
      permissionGroupId: context.params!.permissionGroupId,
    },
  };
};
