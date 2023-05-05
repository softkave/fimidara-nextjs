import { getPublicFimidaraEndpointsUsingUserToken } from "@/lib/api/fimidaraEndpoints";
import {
  CollaborationRequestResponse,
  CollaborationRequestStatusType,
} from "@/lib/definitions/collaborationRequest";
import { getBaseError } from "@/lib/utils/errors";
import { css } from "@emotion/css";
import { useRequest } from "ahooks";
import { Button, Space, Typography, message } from "antd";
import assert from "assert";
import { formatRelative } from "date-fns";
import React from "react";
import { useUserCollaborationRequestFetchHook } from "../../../lib/hooks/fetchHooks";
import PageError from "../../utils/PageError";
import PageLoading from "../../utils/PageLoading";
import PageNothingFound from "../../utils/PageNothingFound";
import { errorMessageNotificatition } from "../../utils/errorHandling";
import InlineLoading from "../../utils/page/InlineLoading";
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
  const data = useUserCollaborationRequestFetchHook({ requestId });
  const error = data.store.error;
  const { resource } = data.store.get(undefined);
  const isLoading = data.store.loading || !data.store.initialized;

  const onRespond = React.useCallback(
    async (response: CollaborationRequestResponse) => {
      try {
        assert(resource);
        const endpoints = getPublicFimidaraEndpointsUsingUserToken();
        const result = await endpoints.collaborationRequests.respondToRequest({
          body: { response, requestId: resource.resourceId },
        });

        message.success("Response submitted.");
      } catch (error) {
        errorMessageNotificatition(error);
      }
    },
    [requestId, resource]
  );

  const respondResult = useRequest(onRespond, { manual: true });

  if (error) {
    return (
      <PageError
        messageText={
          getBaseError(error) || "Error fetching collaboration request."
        }
      />
    );
  } else if (isLoading) {
    return <PageLoading messageText="Loading request..." />;
  } else if (!resource) {
    return <PageNothingFound messageText="Collaboration request not found." />;
  } else {
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
      resource.status === CollaborationRequestStatusType.Accepted
        ? "accepted"
        : resource.status === CollaborationRequestStatusType.Declined
        ? "declined"
        : resource.status === CollaborationRequestStatusType.Revoked
        ? "revoked"
        : "pending";

    const actions =
      resource.status === CollaborationRequestStatusType.Pending ? (
        respondResult.loading ? (
          <InlineLoading />
        ) : (
          <Space size={"middle"}>
            <Button
              danger
              loading={respondResult.loading}
              onClick={() =>
                respondResult.run(CollaborationRequestStatusType.Declined)
              }
            >
              Decline Request
            </Button>
            <Button
              loading={respondResult.loading}
              onClick={() =>
                respondResult.run(CollaborationRequestStatusType.Accepted)
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
}

export default UserCollaborationRequest;
