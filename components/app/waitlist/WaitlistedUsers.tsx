import { errorMessageNotificatition } from "@/components/utils/errorHandling";
import ItemList from "@/components/utils/list/ItemList";
import ListHeader from "@/components/utils/list/ListHeader";
import PageError from "@/components/utils/page/PageError";
import PageLoading from "@/components/utils/page/PageLoading";
import PaginatedContent from "@/components/utils/page/PaginatedContent";
import ThumbnailContent from "@/components/utils/page/ThumbnailContent";
import { appClasses } from "@/components/utils/theme";
import { useFetchArbitraryFetchState } from "@/lib/hooks/fetchHookUtils";
import { useWaitlistedUsersFetchHook } from "@/lib/hooks/fetchHooks";
import { useWaitlistedUsersUpgradeMutationHook } from "@/lib/hooks/mutationHooks";
import { useSelectList } from "@/lib/hooks/useSelectList";
import { getBaseError } from "@/lib/utils/errors";
import { Button, Space, Tag, Typography, message } from "antd";
import React from "react";

// TODO: add bulk remove, and add bulk actions to other lists

const WaitlistedUsers: React.FC<{}> = (props) => {
  const { fetchState, clearFetchState } =
    useWaitlistedUsersFetchHook(undefined);
  const { error, isLoading, data } = useFetchArbitraryFetchState(fetchState);
  const selectedHook = useSelectList();
  const upgradeHook = useWaitlistedUsersUpgradeMutationHook({
    onSuccess(data, params) {
      message.success("Waitlisted users upgraded.");
      clearFetchState();
      selectedHook.clear();
    },
    onError(e, params) {
      errorMessageNotificatition(e, "Error deleting upgrading users.");
    },
  });
  const hasSelected = selectedHook.hasSelected();

  let content: React.ReactNode = null;

  if (error) {
    content = (
      <PageError
        message={getBaseError(error) || "Error fetching waitlisted users."}
      />
    );
  } else if (isLoading) {
    content = <PageLoading message="Loading waitlisted users..." />;
  } else if (data) {
    content = (
      <ItemList
        items={data.users}
        renderItem={(item) => {
          return (
            <ThumbnailContent
              withCheckbox
              key={item.resourceId}
              selected={selectedHook.selected[item.resourceId]}
              onSelect={(checked) => selectedHook.set(item.resourceId, checked)}
              main={
                <div className={appClasses.thumbnailMain} style={{ rowGap: 4 }}>
                  <Typography.Text>
                    {item.firstName} {item.lastName}
                  </Typography.Text>
                  <Typography.Text type="secondary">
                    {item.email}
                  </Typography.Text>
                  <div>
                    <Tag>
                      {item.isEmailVerified
                        ? "Email verified"
                        : "Not email verified"}
                    </Tag>
                  </div>
                </div>
              }
            />
          );
        }}
        getId={(item) => item.resourceId}
        emptyMessage={"No waitlisted users."}
      />
    );
  }

  const controlsNode = (
    <Button
      loading={upgradeHook.loading}
      disabled={!hasSelected}
      onClick={() =>
        upgradeHook.run({
          body: { userIds: selectedHook.getList() },
        })
      }
    >
      Upgrade users
    </Button>
  );

  return (
    <Space direction="vertical" style={{ width: "100%" }} size="large">
      <ListHeader label="Waitlisted Users" secondaryControls={controlsNode} />
      <PaginatedContent content={content} />
    </Space>
  );
};

export default WaitlistedUsers;
