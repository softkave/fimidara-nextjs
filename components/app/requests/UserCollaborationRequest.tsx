import { Button, message, Space, Typography } from "antd";
import React from "react";
import { formatRelative } from "date-fns";
import { useSWRConfig } from "swr";
import useCollaborationRequest, {
  getUseCollaborationRequestHookKey,
} from "../../../lib/hooks/requests/useRequest";
import PageError from "../../utils/PageError";
import PageLoading from "../../utils/PageLoading";
import {
  CollaborationRequestResponse,
  CollaborationRequestStatusType,
  ICollaborationRequest,
} from "../../../lib/definitions/collaborationRequest";
import CollaborationRequestAPI from "../../../lib/api/endpoints/collaborationRequest";
import assert from "assert";
import { useRequest } from "ahooks";
import { getBaseError } from "../../../lib/utilities/errors";
import { messages } from "../../../lib/definitions/messages";
import { checkEndpointResult } from "../../../lib/api/utils";
import AppHeader from "../AppHeader";
import withPageAuthRequired from "../../hoc/withPageAuthRequired";
import { appDimensions } from "../../utils/theme";
import { css } from "@emotion/css";
import { last } from "lodash";
import InlineLoading from "../../utils/InlineLoading";

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
  const { error, isLoading, data } = useCollaborationRequest(requestId);
  const { mutate } = useSWRConfig();
  const onRespond = React.useCallback(
    async (response: CollaborationRequestResponse) => {
      try {
        assert(data);
        // const updatedRequest: ICollaborationRequest = {
        //   ...data.request,
        //   statusHistory: data.request.statusHistory.concat({
        //     status: response,
        //     date: new Date().toISOString(),
        //   }),
        // };

        // mutate(
        //   getUseCollaborationRequestHookKey(requestId),
        //   { request: updatedRequest },
        //   false
        // );

        const result = await CollaborationRequestAPI.respondToRequest({
          response,
          requestId: data.request.resourceId,
        });

        checkEndpointResult(result);
        mutate(getUseCollaborationRequestHookKey(requestId), result, false);
        message.success("Response submitted");
      } catch (error) {
        message.error(getBaseError(error) || messages.requestError);
      }
    },
    [requestId, data, mutate]
  );

  const respondResult = useRequest(onRespond, { manual: true });
  let content: React.ReactNode = null;

  if (error) {
    content = (
      <PageError
        messageText={getBaseError(error) || "Error fetching request"}
      />
    );
  } else if (isLoading || !data) {
    content = <PageLoading messageText="Loading request..." />;
  } else {
    const request = data.request;
    const createdDate = formatRelative(new Date(request.createdAt), new Date());
    const expirationDate =
      request.expiresAt &&
      formatRelative(new Date(request.expiresAt), new Date());
    const status = last(request.statusHistory);
    const statusDate =
      status?.date && formatRelative(new Date(status.date), new Date());
    const statusText =
      status?.status === CollaborationRequestStatusType.Accepted
        ? "accepted"
        : status?.status === CollaborationRequestStatusType.Declined
        ? "declined"
        : status?.status === CollaborationRequestStatusType.Revoked
        ? "revoked"
        : "pending";

    const actions =
      status?.status === CollaborationRequestStatusType.Pending ? (
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

    content = (
      <div className={classes.main}>
        <Space direction="vertical" size={"large"}>
          <Space direction="vertical" size={2}>
            <Typography.Title level={4} style={{ margin: 0 }}>
              Collaboration Request from {request.workspaceName}
            </Typography.Title>
            <Typography.Text type="secondary">
              Sent {createdDate}
            </Typography.Text>
          </Space>
          <Space direction="vertical" size={2}>
            <Typography.Paragraph>{request.message}</Typography.Paragraph>
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

  return (
    <Space direction="vertical" size={"large"} style={{ width: "100%" }}>
      <AppHeader />
      {content}
    </Space>
  );
}

export default withPageAuthRequired(UserCollaborationRequest);
