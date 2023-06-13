import PermissionGroupForm from "@/components/app/workspaces/permissionGroups/PermissionGroupForm";
import withPageAuthRequiredHOC from "@/components/hoc/withPageAuthRequired";
import PageError from "@/components/utils/page/PageError";
import PageLoading from "@/components/utils/page/PageLoading";
import { useFetchSingleResourceFetchState } from "@/lib/hooks/fetchHookUtils";
import { useWorkspacePermissionGroupFetchHook } from "@/lib/hooks/singleResourceFetchHooks";
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
  const { fetchState } = useWorkspacePermissionGroupFetchHook({
    permissionGroupId,
  });
  const { isLoading, error, resource } =
    useFetchSingleResourceFetchState(fetchState);

  if (error) {
    return (
      <PageError
        message={getBaseError(error) || "Error fetching permission group."}
      />
    );
  } else if (isLoading || !resource) {
    return <PageLoading message="Loading permission group..." />;
  } else {
    return (
      <PermissionGroupForm
        workspaceId={resource.workspaceId}
        permissionGroup={resource}
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
