import { Alert, AlertProps, message, Typography } from "antd";
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

export function enrichErrorMessage(error: any) {
  let errorMessage: React.ReactNode = getBaseError(
    error || messages.requestError
  );
  const hasEmailNotVerifiedError = hasErrorTypes(error, [
    EmailAddressNotVerifiedError.name,
  ]);

  if (hasEmailNotVerifiedError) {
    errorMessage = (
      <Typography.Text>
        {errorMessage}{" "}
        <Link passHref href={appUserPaths.settings}>
          <a>Goto Settings</a>
        </Link>
      </Typography.Text>
    );
  }

  return errorMessage;
}

export function errorMessageNotificatition(error: any) {
  const errorMessage = enrichErrorMessage(error);
  message.error(errorMessage);
}

export function throwErrorForUseRequestHandling(error: any) {
  const errorList = toAppErrorsArray(error);

  if (errorList.length > 0) {
    throw errorList[0];
  }

  throw new Error(messages.requestError);
}
