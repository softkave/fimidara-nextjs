import { useFetchSingleResourceFetchState } from "@/lib/hooks/fetchHookUtils";
import { useUserCollaborationRequestResponseMutationHook } from "@/lib/hooks/mutationHooks";
import { useUserCollaborationRequestFetchHook } from "@/lib/hooks/singleResourceFetchHooks";
import { getBaseError } from "@/lib/utils/errors";
import { css } from "@emotion/css";
import { Button, Space, Typography, message } from "antd";
import { formatRelative } from "date-fns";
import { errorMessageNotificatition } from "../../utils/errorHandling";
import InlineLoading from "../../utils/page/InlineLoading";
import PageError from "../../utils/page/PageError";
import PageLoading from "../../utils/page/PageLoading";
import PageNothingFound from "../../utils/page/PageNothingFound";
import { appDimensions } from "../../utils/theme";

export interface IUserCollaborationRequestProps {
  requestId: string;
}

const classes = {
  main: css({
    width: "100%",
    maxWidth: appDimensions.app.maxWidth,
    margin: "auto",
  }),
};

function UserCollaborationRequest(props: IUserCollaborationRequestProps) {
  const { requestId } = props;
  const { fetchState } = useUserCollaborationRequestFetchHook({ requestId });
  const { isLoading, error, resource } =
    useFetchSingleResourceFetchState(fetchState);
  const respondHook = useUserCollaborationRequestResponseMutationHook({
    onSuccess(data, params) {
      message.success("Response submitted.");
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
          <Typography.Text>
            Collaboration request{" "}
            <Typography.Text strong>{statusText}</Typography.Text> {statusDate}
          </Typography.Text>
        );

      return (
        <div className={classes.main}>
          <Space direction="vertical" size={"large"}>
            <Space direction="vertical" size={2}>
              <Typography.Title level={4} style={{ margin: 0 }}>
                Collaboration Request from {resource.workspaceName}
              </Typography.Title>
              <Typography.Text type="secondary">
                Sent {createdDate}
              </Typography.Text>
            </Space>
            <Space direction="vertical" size={2}>
              <Typography.Paragraph>{resource.message}</Typography.Paragraph>
              {expirationDate && (
                <Typography.Text type="secondary">
                  Expires {expirationDate}
                </Typography.Text>
              )}
            </Space>
            {actions}
          </Space>
        </div>
      );
    }
  } else if (error) {
    return (
      <PageError
        message={getBaseError(error) || "Error fetching collaboration request."}
      />
    );
  } else if (isLoading) {
    return <PageLoading message="Loading request..." />;
  } else {
    return <PageNothingFound message="Collaboration request not found." />;
  }
}

export default UserCollaborationRequest;
