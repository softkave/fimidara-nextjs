import { message, Typography } from "antd";
import { ArgsProps } from "antd/lib/message";
import Link from "next/link";
import React from "react";
import { appUserPaths } from "../../lib/definitions/system";
import { messages } from "../../lib/messages/messages";
import {
  EmailAddressNotVerifiedError,
  getBaseError,
  hasErrorTypes,
  toAppErrorsArray,
} from "../../lib/utilities/errors";
import { appComponentConstants } from "./utils";

export function enrichErrorMessage(error: any) {
  if (!error) {
    return "";
  }

  let errorMessage: React.ReactNode = getBaseError(error);
  const hasEmailNotVerifiedError = hasErrorTypes(error, [
    EmailAddressNotVerifiedError.name,
  ]);

  if (hasEmailNotVerifiedError) {
    errorMessage = (
      <Typography.Text>
        {errorMessage}
        {" - "}
        <Link passHref href={appUserPaths.settings}>
          <a>Goto Settings</a>
        </Link>{" "}
        to verify your email address.
      </Typography.Text>
    );
  }

  return errorMessage;
}

export function errorMessageNotificatition(
  error: any,
  defaultMessage = messages.requestError,
  props: Partial<ArgsProps> = {}
) {
  const errorMessage = enrichErrorMessage(error) || defaultMessage;
  message.error({
    type: "error",
    content: errorMessage,
    duration: appComponentConstants.messageDuration,
    ...props,
  });
}

export function throwErrorForUseRequestHandling(error: any) {
  const errorList = toAppErrorsArray(error);

  if (errorList.length > 0) {
    throw errorList[0];
  }

  throw new Error(messages.requestError);
}
