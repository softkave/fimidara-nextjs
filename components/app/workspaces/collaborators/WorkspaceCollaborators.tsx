import { appWorkspacePaths } from "@/lib/definitions/system";
import { useFetchPaginatedResourceListFetchState } from "@/lib/hooks/fetchHookUtils";
import { useWorkspaceCollaboratorsFetchHook } from "@/lib/hooks/fetchHooks";
import usePagination from "@/lib/hooks/usePagination";
import { getBaseError } from "@/lib/utils/errors";
import { PlusOutlined } from "@ant-design/icons";
import { Space } from "antd";
import { Collaborator } from "fimidara";
import Link from "next/link";
import React from "react";
import IconButton from "../../../utils/buttons/IconButton";
import ListHeader from "../../../utils/list/ListHeader";
import PageError from "../../../utils/page/PageError";
import PageLoading from "../../../utils/page/PageLoading";
import PageNothingFound from "../../../utils/page/PageNothingFound";
import PaginatedContent from "../../../utils/page/PaginatedContent";
import CollaboratorList from "./CollaboratorList";

export interface IWorkspaceCollaboratorsProps {
  workspaceId: string;
  renderItem?: (item: Collaborator) => React.ReactNode;
  renderList?: (items: Collaborator[]) => React.ReactNode;
  renderRoot?: (node: React.ReactNode) => React.ReactElement;
  menu?: React.ReactNode;
}

const WorkspaceCollaborators: React.FC<IWorkspaceCollaboratorsProps> = (
  props
) => {
  const { workspaceId, menu, renderList, renderRoot, renderItem } = props;
  const pagination = usePagination();
  const { fetchState } = useWorkspaceCollaboratorsFetchHook({
    workspaceId,
    page: pagination.page,
    pageSize: pagination.pageSize,
  });
  const { count, error, isLoading, resourceList } =
    useFetchPaginatedResourceListFetchState(fetchState);

  let content: React.ReactNode = null;

  if (error) {
    content = (
      <PageError
        message={getBaseError(error) || "Error fetching collaborators."}
      />
    );
  } else if (isLoading) {
    content = <PageLoading message="Loading collaborators..." />;
  } else if (resourceList.length === 0) {
    content = (
      <PageNothingFound message="No collaborators yet. Create one using the plus button above." />
    );
  } else {
    content = renderList ? (
      renderList(resourceList as Collaborator[])
    ) : (
      <CollaboratorList
        workspaceId={workspaceId}
        collaborators={resourceList as Collaborator[]}
        renderItem={renderItem}
      />
    );
  }

  content = (
    <PaginatedContent
      content={content}
      pagination={count ? { ...pagination, count } : undefined}
    />
  );

  if (renderRoot) {
    return renderRoot(content);
  }

  return (
    <Space direction="vertical" style={{ width: "100%" }} size="large">
      <ListHeader
        label="Collaborators"
        buttons={
          <Space>
            <Link href={appWorkspacePaths.createRequestForm(workspaceId)}>
              <IconButton icon={<PlusOutlined />} />
            </Link>
            {menu}
          </Space>
        }
      />
      {content}
    </Space>
  );
};

export default WorkspaceCollaborators;
