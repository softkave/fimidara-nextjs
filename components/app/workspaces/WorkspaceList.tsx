"use client";

import IconButton from "@/components/utils/buttons/IconButton";
import ItemList from "@/components/utils/list/ItemList";
import ListHeader from "@/components/utils/list/ListHeader";
import PageContent02 from "@/components/utils/page/PageContent02";
import PageNothingFound from "@/components/utils/page/PageNothingFound";
import PaginatedContent from "@/components/utils/page/PaginatedContent";
import ThumbnailContent from "@/components/utils/page/ThumbnailContent.tsx";
import { appClasses } from "@/components/utils/theme";
import { appWorkspacePaths } from "@/lib/definitions/system";
import { useFetchPaginatedResourceListFetchState } from "@/lib/hooks/fetchHookUtils";
import { useUserWorkspacesFetchHook } from "@/lib/hooks/fetchHooks";
import usePagination from "@/lib/hooks/usePagination";
import { PlusOutlined } from "@ant-design/icons";
import { Button } from "antd";
import Text from "antd/es/typography/Text";
import { User, Workspace } from "fimidara";
import { noop } from "lodash-es";
import Link from "next/link";
import React from "react";
import WorkspaceAvatar from "./WorkspaceAvatar.tsx";
import WorkspaceMenu from "./WorkspaceMenu.tsx";

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
  const { count, error, isLoading, resourceList, isDataFetched } =
    useFetchPaginatedResourceListFetchState(fetchState);

  const contentNode = (
    <PageContent02
      error={error}
      isLoading={isLoading}
      isDataFetched={isDataFetched}
      data={resourceList}
      defaultErrorMessage="Error fetching workspaces"
      defaultLoadingMessage="Loading workspaces..."
      render={(data) => (
        <ItemList
          bordered
          items={data}
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
                    <Text strong>{item.name}</Text>
                  </Link>
                  {item.description && (
                    <Text type="secondary">{item.description}</Text>
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
                    "Once you've been upgraded from the waitlist, we'll send an email to you confirming the upgrade"
                  : "Create a workspace to get started"
              }
            />
          }
        />
      )}
    />
  );

  return (
    <div className="space-y-4">
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
        content={contentNode}
        pagination={count ? { ...pagination, count } : undefined}
      />
    </div>
  );
};

export default WorkspaceList;
