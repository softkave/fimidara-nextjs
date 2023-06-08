import withPageAuthRequiredHOC from "@/components/hoc/withPageAuthRequired";
import IconButton from "@/components/utils/buttons/IconButton";
import ItemList from "@/components/utils/list/ItemList";
import ListHeader from "@/components/utils/list/ListHeader";
import PageError from "@/components/utils/page/PageError";
import PageLoading from "@/components/utils/page/PageLoading";
import PageNothingFound from "@/components/utils/page/PageNothingFound";
import PaginatedContent from "@/components/utils/page/PaginatedContent";
import { appClasses } from "@/components/utils/theme";
import { appWorkspacePaths } from "@/lib/definitions/system";
import { useFetchPaginatedResourceListFetchState } from "@/lib/hooks/fetchHookUtils";
import { useUserWorkspacesFetchHook } from "@/lib/hooks/fetchHooks";
import usePagination from "@/lib/hooks/usePagination";
import { getBaseError } from "@/lib/utils/errors";
import { PlusOutlined } from "@ant-design/icons";
import { Button, Space, Typography } from "antd";
import { User, Workspace } from "fimidara";
import { noop } from "lodash";
import Link from "next/link";
import React from "react";
import ThumbnailContent from "../../utils/page/ThumbnailContent";
import WorkspaceAvatar from "./WorkspaceAvatar";
import WorkspaceMenu from "./WorkspaceMenu";

export interface IWorkspaceListProps {
  user: User;
}

const WorkspaceList: React.FC<IWorkspaceListProps> = (props) => {
  const { user } = props;
  const pagination = usePagination();
  const { fetchState } = useUserWorkspacesFetchHook({
    page: pagination.page,
    pageSize: pagination.pageSize,
  });
  const { count, error, isLoading, resourceList } =
    useFetchPaginatedResourceListFetchState(fetchState);

  let content: React.ReactNode = null;

  if (error) {
    content = (
      <PageError
        message={getBaseError(error) || "Error fetching workspaces."}
      />
    );
  } else if (isLoading) {
    content = <PageLoading message="Loading workspaces..." />;
  } else {
    content = (
      <ItemList
        bordered
        items={resourceList}
        getId={(item: Workspace) => item.resourceId}
        renderItem={(item: Workspace) => (
          <ThumbnailContent
            key={item.resourceId}
            prefixNode={
              <WorkspaceAvatar
                workspaceId={item.resourceId}
                alt={`Workspace picture for ${item.name}`}
              />
            }
            main={
              <div className={appClasses.thumbnailMain}>
                <Link href={appWorkspacePaths.folderList(item.resourceId)}>
                  <Typography.Text strong>{item.name}</Typography.Text>
                </Link>
                {item.description && (
                  <Typography.Text type="secondary">
                    {item.description}
                  </Typography.Text>
                )}
              </div>
            }
            menu={
              <WorkspaceMenu
                key="menu"
                workspace={item}
                onCompleteDelete={noop}
              />
            }
          />
        )}
        emptyMessage={
          <PageNothingFound
            message={
              user.isOnWaitlist
                ? "You are currently on the waitlist so you can't create workspaces, " +
                  "but you can be added to an existing workspace. " +
                  "Once you've been upgraded from the waitlist, we'll send an email to you confirming the upgrade."
                : "Create a workspace to get started."
            }
          />
        }
      />
    );
  }

  return (
    <Space direction="vertical" style={{ width: "100%" }} size="large">
      <ListHeader
        label="Workspaces"
        buttons={
          user.isOnWaitlist ? (
            <Button disabled icon={<PlusOutlined />} />
          ) : (
            <Link href={appWorkspacePaths.createWorkspaceForm}>
              <IconButton icon={<PlusOutlined />} />
            </Link>
          )
        }
      />
      <PaginatedContent
        content={content}
        pagination={count ? { ...pagination, count } : undefined}
      />
    </Space>
  );
};

export default withPageAuthRequiredHOC(WorkspaceList);
