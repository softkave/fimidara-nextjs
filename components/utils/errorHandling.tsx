import { appUserPaths } from "@/lib/definitions/system.ts";
import { messages } from "@/lib/messages/messages.ts";
import { message } from "antd";
import Text from "antd/es/typography/Text";
import { ArgsProps } from "antd/lib/message";
import Link from "next/link";
import React from "react";
import { appComponentConstants, htmlCharacterCodes } from "./utils";
import {
  getBaseError,
  hasErrorTypes,
  EmailAddressNotVerifiedError,
  toAppErrorList,
} from "@/lib/utils/errors.ts";

export function enrichErrorMessage(error: any) {
  if (!error) {
    return "";
  }

  let errorMessage: React.ReactElement = getBaseError(error);
  const hasEmailNotVerifiedError = hasErrorTypes(error, [
    EmailAddressNotVerifiedError.name,
  ]);

  if (hasEmailNotVerifiedError) {
    errorMessage = (
      <Text>
        {errorMessage} {htmlCharacterCodes.doubleDash}{" "}
        <Link href={appUserPaths.settings}>
          <a>Goto Settings</a>
        </Link>{" "}
        to verify your email address.
      </Text>
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
  const errorList = toAppErrorList(error);

  if (errorList.length > 0) {
    throw errorList[0];
  }

  throw new Error(messages.requestError);
}
