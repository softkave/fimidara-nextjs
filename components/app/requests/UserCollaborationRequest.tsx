import { errorMessageNotificatition } from "@/components/utils/errorHandling.tsx";
import InlineLoading from "@/components/utils/page/InlineLoading.tsx";
import PageError from "@/components/utils/page/PageError.tsx";
import PageLoading from "@/components/utils/page/PageLoading.tsx";
import PageNothingFound from "@/components/utils/page/PageNothingFound.tsx";
import { appDimensions } from "@/components/utils/theme.ts";
import { useUserCollaborationRequestFetchHook } from "@/lib/hooks/fetchHooks/userCollaborationRequest.ts";
import { useFetchSingleResourceFetchState } from "@/lib/hooks/fetchHookUtils";
import { useUserCollaborationRequestResponseMutationHook } from "@/lib/hooks/mutationHooks";
import { getBaseError } from "@/lib/utils/errors";
import { css } from "@emotion/css";
import { Button, Space, message } from "antd";
import Paragraph from "antd/es/typography/Paragraph";
import Text from "antd/es/typography/Text";
import Title from "antd/es/typography/Title";
import { formatRelative } from "date-fns";

export interface IUserCollaborationRequestProps {
  params: { requestId: string };
}

const classes = {
  main: css({
    width: "100%",
    maxWidth: appDimensions.app.maxWidth,
    margin: "auto",
  }),
};

function UserCollaborationRequest(props: IUserCollaborationRequestProps) {
  const { requestId } = props.params;
  const { fetchState, clearFetchState } = useUserCollaborationRequestFetchHook({
    requestId,
  });
  const { isLoading, error, resource } =
    useFetchSingleResourceFetchState(fetchState);
  const respondHook = useUserCollaborationRequestResponseMutationHook({
    onSuccess(data, params) {
      message.success("Response submitted");
      clearFetchState();
    },
    onError(e, params) {
      errorMessageNotificatition(e);
    },
  });

  if (resource) {
    {
      const createdDate = formatRelative(
        new Date(resource.createdAt),
        new Date()
      );
      const expirationDate =
        resource.expiresAt &&
        formatRelative(new Date(resource.expiresAt), new Date());
      const statusDate = formatRelative(
        new Date(resource.statusDate),
        new Date()
      );
      const statusText =
        resource.status === "accepted"
          ? "accepted"
          : resource.status === "declined"
          ? "declined"
          : resource.status === "revoked"
          ? "revoked"
          : "pending";

      const actions =
        resource.status === "pending" ? (
          respondHook.loading ? (
            <InlineLoading />
          ) : (
            <Space size={"middle"}>
              <Button
                danger
                loading={respondHook.loading}
                onClick={() =>
                  respondHook.run({
                    body: {
                      requestId: resource.resourceId,
                      response: "declined",
                    },
                  })
                }
              >
                Decline Request
              </Button>
              <Button
                loading={respondHook.loading}
                onClick={() =>
                  respondHook.run({
                    body: {
                      requestId: resource.resourceId,
                      response: "accepted",
                    },
                  })
                }
              >
                Accept Request
              </Button>
            </Space>
          )
        ) : (
          <Text>
            Collaboration request <Text strong>{statusText}</Text> {statusDate}
          </Text>
        );

      return (
        <div className={classes.main}>
          <Space direction="vertical" size={"large"}>
            <Space direction="vertical" size={2}>
              <Title level={4} style={{ margin: 0 }}>
                Collaboration Request from {resource.workspaceName}
              </Title>
              <Text type="secondary">Sent {createdDate}</Text>
            </Space>
            {resource.message && expirationDate ? (
              <Space direction="vertical" size={2}>
                {resource.message && <Paragraph>{resource.message}</Paragraph>}
                {expirationDate && (
                  <Text type="secondary">Expires {expirationDate}</Text>
                )}
              </Space>
            ) : null}
            {actions}
          </Space>
        </div>
      );
    }
  } else if (error) {
    return (
      <PageError
        message={getBaseError(error) || "Error fetching collaboration request"}
      />
    );
  } else if (isLoading) {
    return <PageLoading message="Loading request..." />;
  } else {
    return <PageNothingFound message="Collaboration request not found" />;
  }
}

export default UserCollaborationRequest;
