import PermissionGroupForm from "@/components/app/workspaces/permissionGroups/PermissionGroupForm";
import withPageAuthRequiredHOC from "@/components/hoc/withPageAuthRequired";
import PageError from "@/components/utils/page/PageError";
import PageLoading from "@/components/utils/page/PageLoading";
import usePermissionGroup from "@/lib/hooks/workspaces/usePermissionGroup";
import { getBaseError } from "@/lib/utils/errors";
import { GetServerSideProps } from "next";
import React from "react";

export type IWorkspacePermissionGroupFormPageProps = {
  workspaceId: string;
  permissionGroupId: string;
};

const WorkspacePermissionGroupFormPage: React.FC<
  IWorkspacePermissionGroupFormPageProps
> = (props) => {
  const { workspaceId, permissionGroupId } = props;
  const { error, isLoading, data } = usePermissionGroup(permissionGroupId);

  if (error) {
    return (
      <PageError
        message={getBaseError(error) || "Error fetching permission group."}
      />
    );
  } else if (isLoading || !data) {
    return <PageLoading message="Loading permission group..." />;
  } else {
    return (
      <PermissionGroupForm
        workspaceId={data.permissionGroup.workspaceId}
        permissionGroup={data.permissionGroup}
      />
    );
  }
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
