import { css } from "@emotion/css";
import { useRequest } from "ahooks";
import { Button, message, Space, Typography } from "antd";
import assert from "assert";
import { formatRelative } from "date-fns";
import { last } from "lodash";
import React from "react";
import { useSWRConfig } from "swr";
import CollaborationRequestAPI from "../../../lib/api/endpoints/collaborationRequest";
import { checkEndpointResult } from "../../../lib/api/utils";
import {
  CollaborationRequestResponse,
  CollaborationRequestStatusType,
} from "../../../lib/definitions/collaborationRequest";
import useCollaborationRequest, {
  getUseCollaborationRequestHookKey,
} from "../../../lib/hooks/requests/useRequest";
import { getBaseError } from "../../../lib/utils/errors";
import withPageAuthRequiredHOC from "../../hoc/withPageAuthRequired";
import { errorMessageNotificatition } from "../../utils/errorHandling";
import InlineLoading from "../../utils/InlineLoading";
import PageError from "../../utils/PageError";
import PageLoading from "../../utils/PageLoading";
import { appDimensions } from "../../utils/theme";
import LoggedInHeader from "../LoggedInHeader";

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
        const result = await CollaborationRequestAPI.respondToRequest({
          response,
          requestId: data.request.resourceId,
        });

        checkEndpointResult(result);
        mutate(getUseCollaborationRequestHookKey(requestId), result, false);
        message.success("Response submitted");
      } catch (error) {
        errorMessageNotificatition(error);
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
      <LoggedInHeader />
      {content}
    </Space>
  );
}

export default withPageAuthRequiredHOC(UserCollaborationRequest);
