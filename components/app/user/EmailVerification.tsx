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
import {
  formBodyClassName,
  formContentWrapperClassName,
} from "../../form/classNames";

export default function EmailVerification() {
  const { isLoading, error, data } = useUser();
  const { startCooldown, isInCooldown } = useCooldown();
  const onSubmit = React.useCallback(async () => {
    try {
      const result = await UserEndpoint.sendEmailVerificationCode();
      checkEndpointResult(result);
      message.success("Email verification link sent");
      startCooldown();
    } catch (error: any) {
      errorMessageNotificatition(error);
    }
  }, []);

  const submitResult = useRequest(onSubmit, { manual: true });
  let rootNode: React.ReactNode = null;

  if (error) {
    rootNode = (
      <Alert
        type="error"
        message={getBaseError(error) || "Error fetching user"}
      />
    );
  } else if (isLoading || !data) {
    rootNode = <InlineLoading messageText="Loading user..." />;
  } else if (data?.user.isEmailVerified) {
    rootNode = (
      <Typography.Text type="success">
        Your email address is verified
      </Typography.Text>
    );
  } else if (data && !data.user.isEmailVerified) {
    rootNode = (
      <Space direction="vertical">
        <Typography.Text type="danger">
          Your email address is not verified.
        </Typography.Text>
        <Button
          onClick={submitResult.run}
          loading={submitResult.loading}
          disabled={isInCooldown}
        >
          Send Email Verification Link to {data.user.email}
        </Button>
      </Space>
    );
  } else {
    rootNode = <Typography.Text>Hello there!</Typography.Text>;
  }

  return (
    <div className={formBodyClassName}>
      <div className={formContentWrapperClassName}>{rootNode}</div>
    </div>
  );
}
