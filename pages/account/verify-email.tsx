import { message, notification, Typography } from "antd";
import React from "react";
import { useRequest } from "ahooks";
import { formBodyClassName } from "../../components/form/classNames";
import UserEndpoint from "../../lib/api/endpoints/user";
import {
  appWorkspacePaths,
  systemConstants,
} from "../../lib/definitions/system";
import { useRouter } from "next/router";
import { errorMessageNotificatition } from "../../components/utils/errorHandling";

export interface IVerifyEmailProps {}

export default function VerifyEmail(props: IVerifyEmailProps) {
  const router = useRouter();
  const onSubmit = React.useCallback(async () => {
    try {
      const query = new URLSearchParams(window.location.search);
      const token = query.get(systemConstants.confirmEmailTokenQueryParam);

      if (!token) {
        notification.error({
          message: "Email address confirmation token not found",
          description:
            "Please ensure you are using the email confirmation link sent to your email address.",
        });

        return;
      }

      const result = await UserEndpoint.confirmEmailAddress({ token });

      if (result.errors) {
        throw result.errors;
      }

      message.success({
        message: "Email address verified.",
      });

      router.push(appWorkspacePaths.workspaces);
    } catch (error) {
      errorMessageNotificatition(error, "Error verifying email address");
    }
  }, [router]);

  useRequest(onSubmit);
  return (
    <div className={formBodyClassName}>
      <Typography.Text>Verifying email address...</Typography.Text>
    </div>
  );
}
