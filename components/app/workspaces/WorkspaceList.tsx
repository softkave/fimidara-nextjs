import { appWorkspacePaths } from "@/lib/definitions/system";
import usePagination from "@/lib/hooks/usePagination";
import useUser from "@/lib/hooks/useUser";
import { getBaseError } from "@/lib/utils/errors";
import { PlusOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { Workspace } from "fimidara";
import Link from "next/link";
import React from "react";
import { useUserWorkspacesFetchHook } from "../../../lib/hooks/fetchHooks";
import withPageAuthRequiredHOC from "../../hoc/withPageAuthRequired";
import PageError from "../../utils/PageError";
import PageLoading from "../../utils/PageLoading";
import PageNothingFound from "../../utils/PageNothingFound";
import IconButton from "../../utils/buttons/IconButton";
import ItemList from "../../utils/list/ItemList";
import ListHeader from "../../utils/list/ListHeader";
import PaginatedContent from "../../utils/page/PaginatedContent";
import { appClasses } from "../../utils/theme";
import WorkspaceAvatar from "./WorkspaceAvatar";

export interface IWorkspaceListProps {}

const WorkspaceList: React.FC<IWorkspaceListProps> = () => {
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
  const user = useUser();

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
              user.data?.user.isOnWaitlist
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
            user.data?.user.isOnWaitlist ? (
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
