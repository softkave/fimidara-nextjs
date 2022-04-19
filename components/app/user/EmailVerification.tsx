import { Alert, Button, message, Space, Typography } from "antd";
import React from "react";
import { useRequest } from "ahooks";
import UserEndpoint from "../../../lib/api/endpoints/user";
import { checkEndpointResult } from "../../../lib/api/utils";
import useUser from "../../../lib/hooks/useUser";
import { getBaseError } from "../../../lib/utilities/errors";
import InlineLoading from "../../utils/InlineLoading";
import useCooldown from "../../hooks/useCooldown";
import { errorMessageNotificatition } from "../../utils/errorHandling";

export default function EmailVerification() {
  const { isLoading, error, data, mutate } = useUser();
  const { startCooldown, isInCooldown } = useCooldown();
  const onSubmit = React.useCallback(async () => {
    try {
      const result = await UserEndpoint.sendEmailVerificationCode();
      checkEndpointResult(result);
      mutate(result, false);
      message.success("Email verification link sent");
      startCooldown();
    } catch (error: any) {
      errorMessageNotificatition(error);
    }
  }, [mutate]);

  const submitResult = useRequest(onSubmit, { manual: true });

  if (error) {
    return (
      <Alert
        type="error"
        message={getBaseError(error) || "Error fetching user"}
      />
    );
  } else if (isLoading || !data) {
    return <InlineLoading messageText="Loading user..." />;
  }

  if (data?.user.isEmailVerified) {
    return (
      <Typography.Text type="success">
        Your email address is verified
      </Typography.Text>
    );
  } else if (data && !data.user.isEmailVerified) {
    return (
      <Space>
        <Typography.Text>Your email address is not verified.</Typography.Text>
        <Button
          onClick={submitResult.run}
          loading={submitResult.loading}
          disabled={isInCooldown}
        >
          Send Email Verification Link to {data.user.email}
        </Button>
      </Space>
    );
  }

  return <Typography.Text>Hello there!</Typography.Text>;
}
