import { message, notification, Typography } from "antd";
import React from "react";
import { useRequest } from "ahooks";
import { formBodyClassName } from "../../components/form/classNames";
import UserEndpoint from "../../lib/api/endpoints/user";
import { toAppErrorsArray } from "../../lib/api/utils";
import { flattenErrorList } from "../../lib/utilities/utils";
import { appOrgPaths, systemConstants } from "../../lib/definitions/system";
import { useRouter } from "next/router";
import { getFormError } from "../../components/form/formUtils";

export interface IVerifyEmailProps {}

export default function VerifyEmail(props: IVerifyEmailProps) {
  const router = useRouter();
  const onSubmit = React.useCallback(async () => {
    try {
      const query = new URLSearchParams(window.location.search);
      const token = query.get(systemConstants.tokenQueryKey);

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

      router.push(appOrgPaths.orgs);
    } catch (error) {
      const errArray = toAppErrorsArray(error);
      const flattenedErrors = flattenErrorList(errArray);
      message.error({
        message:
          getFormError(flattenedErrors) || "Error verifying email address.",
      });
    }
  }, []);

  useRequest(onSubmit);
  return (
    <div className={formBodyClassName}>
      <Typography.Text>Verifying email address...</Typography.Text>
    </div>
  );
}
