import ComponentHeader from "@/components/utils/ComponentHeader";
import LabeledNode from "@/components/utils/LabeledNode";
import PageError from "@/components/utils/PageError";
import PageLoading from "@/components/utils/PageLoading";
import PageNothingFound from "@/components/utils/PageNothingFound";
import { appClasses } from "@/components/utils/theme";
import { appWorkspacePaths } from "@/lib/definitions/system";
import { useFetchSingleResourceFetchState } from "@/lib/hooks/fetchHookUtils";
import { useWorkspacePermissionGroupFetchHook } from "@/lib/hooks/singleResourceFetchHooks";
import { getBaseError } from "@/lib/utils/errors";
import { Space } from "antd";
import assert from "assert";
import { useRouter } from "next/router";
import React from "react";
import PermissionGroupMenu from "./PermissionGroupMenu";

export interface IPermissionGroupProps {
  permissionGroupId: string;
}

function PermissionGroup(props: IPermissionGroupProps) {
  const { permissionGroupId } = props;
  const router = useRouter();
  const { fetchState } = useWorkspacePermissionGroupFetchHook({
    permissionGroupId,
  });
  const { isLoading, error, resource } =
    useFetchSingleResourceFetchState(fetchState);

  const onCompleteDeletePermissionGroup = React.useCallback(async () => {
    assert(resource, new Error("Permission group not found."));
    router.push(appWorkspacePaths.collaboratorList(resource.workspaceId));
  }, [router, resource]);

  if (resource) {
    return (
      <div>
        <Space
          direction="vertical"
          size={32}
          style={{ width: "100%", padding: "16px" }}
        >
          <ComponentHeader
            title={resource.name}
            className={appClasses.mainNoPadding}
          >
            <PermissionGroupMenu
              permissionGroup={resource}
              onCompleteDelete={onCompleteDeletePermissionGroup}
            />
          </ComponentHeader>
          <LabeledNode
            nodeIsText
            copyable
            direction="vertical"
            label="Resource ID"
            node={resource.resourceId}
            className={appClasses.mainNoPadding}
          />
          {resource.description && (
            <LabeledNode
              nodeIsText
              label="Description"
              node={resource.description}
              direction="vertical"
              className={appClasses.mainNoPadding}
            />
          )}
        </Space>
      </div>
    );
  } else if (error) {
    return (
      <PageError
        messageText={getBaseError(error) || "Error fetching permission group."}
      />
    );
  } else if (isLoading) {
    return <PageLoading messageText="Loading permission group..." />;
  } else {
    return <PageNothingFound messageText="Permission group not found." />;
  }
}

export default PermissionGroup;
