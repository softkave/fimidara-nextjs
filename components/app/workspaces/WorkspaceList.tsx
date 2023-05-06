import withPageAuthRequiredHOC from "@/components/hoc/withPageAuthRequired";
import PageError from "@/components/utils/PageError";
import PageLoading from "@/components/utils/PageLoading";
import PageNothingFound from "@/components/utils/PageNothingFound";
import IconButton from "@/components/utils/buttons/IconButton";
import ItemList from "@/components/utils/list/ItemList";
import ListHeader from "@/components/utils/list/ListHeader";
import PaginatedContent from "@/components/utils/page/PaginatedContent";
import { appClasses } from "@/components/utils/theme";
import { appWorkspacePaths } from "@/lib/definitions/system";
import { useUserWorkspacesFetchHook } from "@/lib/hooks/fetchHooks";
import usePagination from "@/lib/hooks/usePagination";
import { getBaseError } from "@/lib/utils/errors";
import { PlusOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { PublicUser, Workspace } from "fimidara";
import Link from "next/link";
import React from "react";
import WorkspaceAvatar from "./WorkspaceAvatar";

export interface IWorkspaceListProps {
  user: PublicUser;
}

const WorkspaceList: React.FC<IWorkspaceListProps> = (props) => {
  const { user } = props;
  const pagination = usePagination();
  const data = useUserWorkspacesFetchHook({
    page: pagination.page,
    pageSize: pagination.pageSize,
  });
  const error = data.store.error;
  const isLoading = data.store.loading || !data.store.initialized;
  const { count, resourceList } = data.store.get({
    page: pagination.page,
    pageSize: pagination.pageSize,
  });

  let content: React.ReactNode = null;

  if (error) {
    content = (
      <PageError
        className={appClasses.main}
        messageText={getBaseError(error) || "Error fetching workspaces."}
      />
    );
  } else if (isLoading) {
    content = <PageLoading messageText="Loading workspaces..." />;
  } else {
    content = (
      <ItemList
        bordered
        className={appClasses.main}
        items={resourceList}
        getId={(item: Workspace) => item.resourceId}
        renderItem={(item: Workspace) => (
          <div>
            <WorkspaceAvatar
              workspaceId={item.resourceId}
              alt={`Workspace picture for ${item.name}`}
            />
            <Link href={appWorkspacePaths.rootFolderList(item.resourceId)}>
              {item.name}
            </Link>
            {item.description}
          </div>
        )}
        emptyMessage={
          <PageNothingFound
            className={appClasses.main}
            messageText={
              user.isOnWaitlist
                ? "You are currently on the waitlist so you can't create workspaces, " +
                  "but you can be added to an existing workspace." +
                  "Once you've been upgraded from the waitlist, we'll send an email to you confirming the upgrade."
                : "Create an workspace to get started."
            }
          />
        }
      />
    );
  }

  return (
    <PaginatedContent
      content={content}
      pagination={count ? { ...pagination, count } : undefined}
      header={
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
      }
    />
  );
};

export default withPageAuthRequiredHOC(WorkspaceList);
