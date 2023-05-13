import ComponentHeader from "@/components/utils/ComponentHeader";
import LabeledNode from "@/components/utils/LabeledNode";
import PageError from "@/components/utils/page/PageError";
import PageLoading from "@/components/utils/page/PageLoading";
import PageNothingFound from "@/components/utils/page/PageNothingFound";
import { appWorkspacePaths } from "@/lib/definitions/system";
import { useFetchSingleResourceFetchState } from "@/lib/hooks/fetchHookUtils";
import { useWorkspacePermissionGroupFetchHook } from "@/lib/hooks/singleResourceFetchHooks";
import { getBaseError } from "@/lib/utils/errors";
import { Space, Typography } from "antd";
import assert from "assert";
import { useRouter } from "next/router";
import React from "react";
import { formatDateTime } from "../../../../lib/utils/dateFns";
import { appClasses } from "../../../utils/theme";
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
        <Space direction="vertical" size={32} style={{ width: "100%" }}>
          <ComponentHeader title={resource.name}>
            <PermissionGroupMenu
              permissionGroup={resource}
              onCompleteDelete={onCompleteDeletePermissionGroup}
            />
          </ComponentHeader>
          <LabeledNode
            nodeIsText
            copyable
            code
            direction="vertical"
            label="Resource ID"
            node={resource.resourceId}
          />
          <LabeledNode
            nodeIsText
            direction="vertical"
            label="Last Updated"
            node={formatDateTime(resource.lastUpdatedAt)}
          />
          {resource.description && (
            <LabeledNode
              direction="vertical"
              label="Description"
              node={
                <Typography.Paragraph
                  ellipsis={{ rows: 2 }}
                  className={appClasses.muteMargin}
                >
                  {resource.description}
                </Typography.Paragraph>
              }
            />
          )}
        </Space>
      </div>
    );
  } else if (error) {
    return (
      <PageError
        message={getBaseError(error) || "Error fetching permission group."}
      />
    );
  } else if (isLoading) {
    return <PageLoading message="Loading permission group..." />;
  } else {
    return <PageNothingFound message="Permission group not found." />;
  }
}

export default PermissionGroup;
