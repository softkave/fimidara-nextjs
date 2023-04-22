import { Space } from "antd";
import { isUndefined } from "lodash";
import React from "react";
import { PermissionItemAppliesTo } from "../../../../lib/definitions/permissionItem";
import { IProgramAccessToken } from "../../../../lib/definitions/programAccessToken";
import {
  AppResourceType,
  appWorkspacePaths,
} from "../../../../lib/definitions/system";
import usePagination from "../../../../lib/hooks/usePagination";
import useWorkspaceProgramTokenList from "../../../../lib/hooks/workspaces/useWorkspaceProgramTokenList";
import { getBaseError } from "../../../../lib/utils/errors";
import ListHeader from "../../../utils/ListHeader";
import { PaginatedContent } from "../../../utils/page/PaginatedContent";
import PageError from "../../../utils/PageError";
import PageLoading from "../../../utils/PageLoading";
import PageNothingFound from "../../../utils/PageNothingFound";
import { appClasses } from "../../../utils/theme";
import GrantPermissionMenu from "../permissionItems/GrantPermissionMenu";
import ProgramTokenList from "./ProgramTokenList";

export interface IWorkspaceProgramTokensProps {
  workspaceId: string;
  renderItem?: (item: IProgramAccessToken) => React.ReactNode;
  renderList?: (items: IProgramAccessToken[]) => React.ReactNode;
  renderRoot?: (node: React.ReactNode) => React.ReactElement;
  menu?: React.ReactNode;
}

const WorkspaceProgramTokens: React.FC<IWorkspaceProgramTokensProps> = (
  props
) => {
  const { workspaceId, menu, renderItem, renderList, renderRoot } = props;
  const pagination = usePagination();
  const { data, error, isLoading } = useWorkspaceProgramTokenList({
    workspaceId,
    page: pagination.page,
    pageSize: pagination.pageSize,
  });
  let content: React.ReactNode = null;
  if (error) {
    content = (
      <PageError
        className={appClasses.main}
        messageText={
          getBaseError(error) || "Error fetching program access tokens"
        }
      />
    );
  } else if (isLoading || !data) {
    content = <PageLoading messageText="Loading program access tokens..." />;
  } else if (data.tokens.length === 0) {
    content = (
      <PageNothingFound
        className={appClasses.maxWidth420}
        messageText="No program access tokens yet. Create one using the plus button above."
      />
    );
  } else {
    content = renderList ? (
      renderList(data.tokens)
    ) : (
      <ProgramTokenList
        workspaceId={workspaceId}
        tokens={data.tokens}
        renderItem={renderItem}
      />
    );
  }

  content = <PaginatedContent content={content} pagination={pagination} />;
  if (renderRoot) {
    return renderRoot(content);
  }

  return (
    <div className={appClasses.main}>
      <Space direction="vertical" style={{ width: "100%" }} size="large">
        <ListHeader
          title="Program Access Tokens"
          formLinkPath={appWorkspacePaths.createProgramTokenForm(workspaceId)}
          actions={
            !isUndefined(menu) ? (
              menu
            ) : (
              <GrantPermissionMenu
                workspaceId={workspaceId}
                targetType={AppResourceType.ProgramAccessToken}
                containerId={workspaceId}
                containerType={AppResourceType.Workspace}
                appliesTo={PermissionItemAppliesTo.Children}
              />
            )
          }
        />
        {content}
      </Space>
    </div>
  );
};

export default WorkspaceProgramTokens;
