import { appWorkspacePaths } from "@/lib/definitions/system";
import usePagination from "@/lib/hooks/usePagination";
import { getBaseError } from "@/lib/utils/errors";
import { PlusOutlined } from "@ant-design/icons";
import { Space } from "antd";
import { Collaborator } from "fimidara";
import Link from "next/link";
import React from "react";
import { useWorkspaceCollaboratorsFetchHook } from "../../../../lib/hooks/fetchHooks";
import PageError from "../../../utils/PageError";
import PageLoading from "../../../utils/PageLoading";
import PageNothingFound from "../../../utils/PageNothingFound";
import IconButton from "../../../utils/buttons/IconButton";
import ListHeader from "../../../utils/list/ListHeader";
import PaginatedContent from "../../../utils/page/PaginatedContent";
import { appClasses } from "../../../utils/theme";
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
  const collaborators = useWorkspaceCollaboratorsFetchHook({
    workspaceId,
    page: pagination.page,
    pageSize: pagination.pageSize,
  });
  const error = collaborators.store.error;
  const isLoading =
    collaborators.store.loading || !collaborators.store.initialized;
  const { count, resourceList } = collaborators.store.get({
    page: pagination.page,
    pageSize: pagination.pageSize,
  });
  let content: React.ReactNode = null;

  if (error) {
    content = (
      <PageError
        className={appClasses.main}
        messageText={getBaseError(error) || "Error fetching collaborators."}
      />
    );
  } else if (isLoading) {
    content = <PageLoading messageText="Loading collaborators..." />;
  } else if (resourceList.length === 0) {
    content = (
      <PageNothingFound
        className={appClasses.maxWidth420}
        messageText="No collaborators yet. Create one using the plus button above."
      />
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
    <div className={appClasses.main}>
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
    </div>
  );
};

export default WorkspaceCollaborators;
