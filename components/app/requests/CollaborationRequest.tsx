import { Button, message, Space, Typography } from "antd";
import React from "react";
import { matchPath } from "react-router-dom";
import { formatRelative } from "date-fns";
import { useSWRConfig } from "swr";
import { appOrgPaths, appRequestsPaths } from "../../../lib/definitions/system";
import useCollaborationRequest, {
  getUseCollaborationRequestHookKey,
} from "../../../lib/hooks/requests/useRequest";
import useRouteAway from "../../../lib/hooks/useRouteAway";
import PageError from "../../utils/PageError";
import PageLoading from "../../utils/PageLoading";
import {
  CollaborationRequestResponse,
  CollaborationRequestStatusType,
} from "../../../lib/definitions/collaborationRequest";
import CollaborationRequestAPI from "../../../lib/api/endpoints/collaborationRequest";
import assert from "assert";
import { useRequest } from "ahooks";
import { getBaseError } from "../../../lib/utilities/error";
import { messages } from "../../../lib/definitions/messages";
import { checkEndpointResult } from "../../../lib/api/utils";

export default function CollaborationRequest() {
  const routeParams = matchPath(
    appRequestsPaths.requests + "/:requestId",
    window.location.pathname
  );

  const requestId = routeParams?.params.requestId;
  const { error, isLoading, data } = useCollaborationRequest(requestId);
  useRouteAway(appOrgPaths.orgs, !requestId);
  const { mutate } = useSWRConfig();
  const onRespond = React.useCallback(
    async (response: CollaborationRequestResponse) => {
      try {
        assert(requestId, new Error("Request is invalid"));
        const result = await CollaborationRequestAPI.respondToRequest({
          requestId,
          response,
        });

        checkEndpointResult(result);
        mutate(
          getUseCollaborationRequestHookKey(requestId),
          result.request,
          false
        );

        message.success("Response submitted");
      } catch (error) {
        message.error(getBaseError(error) || messages.requestError);
      }
    },
    [requestId]
  );

  const respondResult = useRequest(onRespond, { manual: true });

  if (isLoading || !data) {
    return <PageLoading messageText="Loading request..." />;
  } else if (error) {
    return (
      <PageError messageText={error?.message || "Error fetching request"} />
    );
  }

  const request = data.request;
  const createdDate = formatRelative(new Date(request.createdAt), new Date());
  const expirationDate =
    request.expiresAt &&
    formatRelative(new Date(request.expiresAt), new Date());

  return (
    <Space direction="vertical">
      <Typography.Title>
        Collaboration Request from {request.organizationName}
      </Typography.Title>
      <Typography.Text type="secondary">Sent {createdDate}</Typography.Text>
      <Typography.Paragraph>{request.message}</Typography.Paragraph>
      {expirationDate && (
        <Typography.Text type="secondary">
          Expires {expirationDate}
        </Typography.Text>
      )}
      <Space size={"middle"}>
        <Button
          loading={respondResult.loading}
          type="primary"
          onClick={() =>
            respondResult.run(CollaborationRequestStatusType.Accepted)
          }
        >
          Accept Request
        </Button>
        <Button
          danger
          loading={respondResult.loading}
          type="primary"
          onClick={() =>
            respondResult.run(CollaborationRequestStatusType.Declined)
          }
        >
          Decline Request
        </Button>
      </Space>
    </Space>
  );
}
