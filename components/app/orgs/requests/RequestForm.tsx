import { css, cx } from "@emotion/css";
import {
  Alert,
  Button,
  DatePicker,
  Form,
  Input,
  message,
  Typography,
} from "antd";
import * as yup from "yup";
import React from "react";
import { useRequest } from "ahooks";
import { useRouter } from "next/router";
import { systemValidation } from "../../../../lib/validation/system";
import { messages } from "../../../../lib/definitions/messages";
import {
  checkEndpointResult,
  processAndThrowEndpointError,
} from "../../../../lib/api/utils";
import {
  appOrgPaths,
  systemConstants,
} from "../../../../lib/definitions/system";
import useFormHelpers from "../../../../lib/hooks/useFormHelpers";
import { getFormError } from "../../../form/formUtils";
import FormError from "../../../form/FormError";
import { formClasses } from "../../../form/classNames";
import { signupValidationParts } from "../../../../lib/validation/user";
import {
  ICollaborationRequest,
  ICollaborationRequestInput,
} from "../../../../lib/definitions/collaborationRequest";
import useCollaborationRequest from "../../../../lib/hooks/requests/useRequest";
import CollaborationRequestAPI from "../../../../lib/api/endpoints/collaborationRequest";
import moment from "moment";

const requestValidation = yup.object().shape({
  recipientEmail: signupValidationParts.email.required(messages.emailRequired),
  message: systemValidation.description,
  expires: yup.number(),
});

const initialValues: ICollaborationRequestInput = {
  recipientEmail: "",
  message: "",
  expires: undefined,
};

function getRequestFormInputFromRequest(
  item: ICollaborationRequest
): ICollaborationRequestInput {
  return {
    recipientEmail: item.recipientEmail,
    message: item.message,
    expires: item.expiresAt
      ? new Date(item.expiresAt).toISOString()
      : undefined,
  };
}

export interface IRequestFormProps {
  request?: ICollaborationRequest;
  className?: string;
  orgId: string;
}

export default function RequestForm(props: IRequestFormProps) {
  const { request, className, orgId } = props;
  const router = useRouter();
  const { mutate } = useCollaborationRequest(request?.resourceId);
  const onSubmit = React.useCallback(
    async (data: ICollaborationRequestInput) => {
      console.log({ data });

      try {
        let requestId: string | null = null;

        if (request) {
          const result = await CollaborationRequestAPI.updateRequest({
            requestId: request.resourceId,
            request: data,
          });

          checkEndpointResult(result);
          requestId = result.request.resourceId;
          mutate(result);
          message.success("Collaboration request updated");
        } else {
          const result = await CollaborationRequestAPI.sendRequest({
            organizationId: orgId,
            request: data,
          });

          checkEndpointResult(result);
          requestId = result.request.resourceId;
          message.success("Collaboration request created");
        }

        router.push(appOrgPaths.request(orgId, requestId));
      } catch (error) {
        processAndThrowEndpointError(error);
      }
    },
    [request, orgId]
  );

  const submitResult = useRequest(onSubmit, { manual: true });
  const { formik } = useFormHelpers({
    errors: submitResult.error,
    formikProps: {
      validationSchema: requestValidation,
      initialValues: request
        ? getRequestFormInputFromRequest(request)
        : initialValues,
      onSubmit: submitResult.run,
    },
  });

  const globalError = getFormError(formik.errors);
  const nameNode = (
    <Form.Item
      required
      label="Recipient Email Address"
      help={
        formik.touched?.recipientEmail &&
        formik.errors?.recipientEmail && (
          <FormError
            visible={formik.touched.recipientEmail}
            error={formik.errors.recipientEmail}
          />
        )
      }
      labelCol={{ span: 24 }}
      wrapperCol={{ span: 24 }}
    >
      <Input
        name="recipientEmail"
        value={formik.values.recipientEmail}
        onBlur={formik.handleBlur}
        onChange={formik.handleChange}
        placeholder="Enter recipient email"
        disabled={submitResult.loading}
        maxLength={systemConstants.maxNameLength}
      />
    </Form.Item>
  );

  const messageNode = (
    <Form.Item
      label="Message"
      help={
        formik.touched?.message &&
        formik.errors?.message && (
          <FormError
            visible={formik.touched.message}
            error={formik.errors.message}
          />
        )
      }
      labelCol={{ span: 24 }}
      wrapperCol={{ span: 24 }}
    >
      <Input.TextArea
        name="message"
        value={formik.values.message}
        onBlur={formik.handleBlur}
        onChange={formik.handleChange}
        placeholder="Enter request message"
        disabled={submitResult.loading}
        maxLength={systemConstants.maxDescriptionLength}
        autoSize={{ minRows: 3 }}
      />
    </Form.Item>
  );

  const expiresNode = (
    <Form.Item
      label="Expires"
      help={
        formik.touched?.expires &&
        formik.errors?.expires && (
          <FormError
            visible={formik.touched.expires}
            error={formik.errors.expires}
          />
        )
      }
      labelCol={{ span: 24 }}
      wrapperCol={{ span: 24 }}
    >
      <DatePicker
        showTime
        use12Hours
        // format="h:mm A"
        value={
          formik.values.expires ? moment(formik.values.expires) : undefined
        }
        onChange={(date) =>
          formik.setFieldValue("expires", date?.toISOString())
        }
        placeholder="Request expiration date"
      />
    </Form.Item>
  );

  return (
    <div className={cx(formClasses.formBodyClassName, className)}>
      <div className={formClasses.formContentWrapperClassName}>
        <form onSubmit={formik.handleSubmit}>
          <Form.Item>
            <Typography.Title level={4}>
              Collaboration Request Form
            </Typography.Title>
          </Form.Item>
          {globalError && (
            <Form.Item>
              <Alert type="error" message={globalError} />
            </Form.Item>
          )}
          {nameNode}
          {messageNode}
          {expiresNode}
          <Form.Item className={css({ marginTop: "16px" })}>
            <Button
              block
              type="primary"
              htmlType="submit"
              loading={submitResult.loading}
            >
              {request ? "Update Request" : "Create Request"}
            </Button>
          </Form.Item>
        </form>
      </div>
    </div>
  );
}
