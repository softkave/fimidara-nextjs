import { css, cx } from "@emotion/css";
import { Alert, Button, Form, Input, message, Typography } from "antd";
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
import { presetPermissionsGroupConstants } from "../../../../lib/definitions/presets";
import {
  INewClientAssignedTokenInput,
  IClientAssignedToken,
  clientAssignedTokenConstants,
} from "../../../../lib/definitions/clientAssignedToken";
import ClientAssignedTokenAPI from "../../../../lib/api/endpoints/clientAssignedToken";
import useClientToken from "../../../../lib/hooks/orgs/useClientToken";
import SelectPresetInput from "../permissionGroups/SelectPresetInput";

const clientTokenValidation = yup.object().shape({
  expires: yup.date(),
  presets: yup.array().max(presetPermissionsGroupConstants.maxAssignedPresets),
  providedResourceId: yup
    .string()
    .max(clientAssignedTokenConstants.providedResourceMaxLength),
});

const initialValues: INewClientAssignedTokenInput = {
  expires: undefined,
  presets: [],
  providedResourceId: undefined,
};

export interface IClientTokenFormProps {
  clientToken?: IClientAssignedToken;
  className?: string;
  orgId: string;
}

export default function ClientTokenForm(props: IClientTokenFormProps) {
  const { clientToken, className, orgId } = props;
  const router = useRouter();
  const { mutate } = useClientToken(clientToken?.resourceId);
  const onSubmit = React.useCallback(
    async (data: INewClientAssignedTokenInput) => {
      try {
        let clientTokenId: string | null = null;

        if (clientToken) {
          const result = await ClientAssignedTokenAPI.updateToken({
            token: data,
            tokenId: clientToken.resourceId,
          });

          checkEndpointResult(result);
          clientTokenId = result.token.resourceId;
          mutate(result);
          message.success("Client assigned token updated");
        } else {
          const result = await ClientAssignedTokenAPI.addToken({
            organizationId: orgId,
            token: data,
          });

          checkEndpointResult(result);
          clientTokenId = result.token.resourceId;
          message.success("Client assigned token created");
        }

        router.push(appOrgPaths.clientToken(orgId, clientTokenId));
      } catch (error) {
        processAndThrowEndpointError(error);
      }
    },
    [clientToken, orgId]
  );

  const submitResult = useRequest(onSubmit, { manual: true });
  const { formik } = useFormHelpers({
    errors: submitResult.error,
    formikProps: {
      validationSchema: clientTokenValidation,
      initialValues: clientToken || initialValues,
      onSubmit: submitResult.run,
    },
  });

  const globalError = getFormError(formik.errors);
  const nameNode = (
    <Form.Item
      required
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
      <Input
        name="expires"
        value={formik.values.expires}
        onBlur={formik.handleBlur}
        onChange={formik.handleChange}
        placeholder="Enter token name"
        disabled={submitResult.loading}
        maxLength={systemConstants.maxNameLength}
      />
    </Form.Item>
  );

  const descriptionNode = (
    <Form.Item
      label="Description"
      help={
        formik.touched?.description &&
        formik.errors?.description && (
          <FormError
            visible={formik.touched.description}
            error={formik.errors.description}
          />
        )
      }
      labelCol={{ span: 24 }}
      wrapperCol={{ span: 24 }}
    >
      <Input.TextArea
        name="description"
        value={formik.values.description}
        onBlur={formik.handleBlur}
        onChange={formik.handleChange}
        placeholder="Enter token description"
        disabled={submitResult.loading}
        maxLength={systemConstants.maxDescriptionLength}
        autoSize={{ minRows: 3 }}
      />
    </Form.Item>
  );

  const assignedclientTokensNode = (
    <Form.Item
      label="Assigned presets"
      help={
        formik.touched?.presets &&
        formik.errors?.presets && (
          <FormError
            visible={formik.touched.presets}
            error={formik.errors.presets}
          />
        )
      }
      labelCol={{ span: 24 }}
      wrapperCol={{ span: 24 }}
    >
      <SelectPresetInput
        orgId={orgId}
        value={formik.values.presets || []}
        disabled={submitResult.loading}
        onChange={(items) => formik.setFieldValue("presets", items)}
      />
    </Form.Item>
  );

  return (
    <div className={cx(formClasses.formBodyClassName, className)}>
      <div className={formClasses.formContentWrapperClassName}>
        <form onSubmit={formik.handleSubmit}>
          <Typography.Title level={4}>
            Program Access Token Form
          </Typography.Title>
          {globalError && (
            <Form.Item>
              <Alert type="error" message={globalError} />
            </Form.Item>
          )}
          {nameNode}
          {descriptionNode}
          {assignedclientTokensNode}
          <Form.Item className={css({ marginTop: "16px" })}>
            <Button
              block
              type="primary"
              htmlType="submit"
              loading={submitResult.loading}
            >
              {clientToken ? "Update Token" : "Create Token"}
            </Button>
          </Form.Item>
        </form>
      </div>
    </div>
  );
}
