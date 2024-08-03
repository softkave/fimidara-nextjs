"use client";

import PermissionGroupForm from "@/components/app/workspaces/permissionGroups/PermissionGroupForm";
import { IWorkspaceComponentProps } from "@/components/app/workspaces/utils.ts";
import { usePageAuthRequired } from "@/components/hooks/usePageAuthRequired.tsx";
import PageError from "@/components/utils/page/PageError";
import PageLoading from "@/components/utils/page/PageLoading";
import { useWorkspacePermissionGroupFetchHook } from "@/lib/hooks/fetchHooks/permissionGroup.ts";
import { useFetchSingleResourceFetchState } from "@/lib/hooks/fetchHookUtils";
import { getBaseError } from "@/lib/utils/errors";
import React from "react";

export type IWorkspacePermissionGroupFormPageProps = {
  params: { permissionGroupId: string };
} & IWorkspaceComponentProps;

const WorkspacePermissionGroupFormPage: React.FC<
  IWorkspacePermissionGroupFormPageProps
> = (props) => {
  return usePageAuthRequired({
    render: () => <WorkspacePermissionGroupFormPageContent {...props} />,
  });
};

const WorkspacePermissionGroupFormPageContent: React.FC<
  IWorkspacePermissionGroupFormPageProps
> = (props) => {
  const { permissionGroupId } = props.params;
  const { fetchState } = useWorkspacePermissionGroupFetchHook({
    permissionGroupId,
  });
  const { isLoading, error, resource } =
    useFetchSingleResourceFetchState(fetchState);

  if (error) {
    return (
      <PageError
        message={getBaseError(error) || "Error fetching permission group"}
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

export default WorkspacePermissionGroupFormPage;
