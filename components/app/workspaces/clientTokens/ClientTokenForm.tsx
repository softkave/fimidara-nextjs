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
import {
  checkEndpointResult,
  processAndThrowEndpointError,
} from "../../../../lib/api/utils";
import { appWorkspacePaths } from "../../../../lib/definitions/system";
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
import useClientToken from "../../../../lib/hooks/workspaces/useClientToken";
import SelectPresetInput from "../permissionGroups/SelectPresetInput";
import moment from "moment";

const clientTokenValidation = yup.object().shape({
  expires: yup.string(),
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

function getClientTokenFormInputFromToken(
  item: IClientAssignedToken
): INewClientAssignedTokenInput {
  return {
    expires: item.expires,
    providedResourceId: item.providedResourceId,
    presets: item.presets.map((item) => ({
      presetId: item.presetId,
      order: item.order,
    })),
  };
}

export interface IClientTokenFormProps {
  clientToken?: IClientAssignedToken;
  className?: string;
  workspaceId: string;
}

export default function ClientTokenForm(props: IClientTokenFormProps) {
  const { clientToken, className, workspaceId } = props;
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
            workspaceId: workspaceId,
            token: data,
          });

          checkEndpointResult(result);
          clientTokenId = result.token.resourceId;
          message.success("Client assigned token created");
        }

        router.push(appWorkspacePaths.clientToken(workspaceId, clientTokenId));
      } catch (error) {
        processAndThrowEndpointError(error);
      }
    },
    [clientToken, workspaceId, mutate, router]
  );

  const submitResult = useRequest(onSubmit, { manual: true });
  const { formik } = useFormHelpers({
    errors: submitResult.error,
    formikProps: {
      validationSchema: clientTokenValidation,
      initialValues: clientToken
        ? getClientTokenFormInputFromToken(clientToken)
        : initialValues,
      onSubmit: submitResult.run,
    },
  });

  const globalError = getFormError(formik.errors);
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
        onChange={(date) => {
          formik.setFieldValue("expires", date?.toISOString());
        }}
        placeholder="Token expiration date"
      />
    </Form.Item>
  );

  const providedResourceIdNode = (
    <Form.Item
      label="Provided Resource ID"
      help={
        formik.touched?.providedResourceId &&
        formik.errors?.providedResourceId && (
          <FormError
            visible={formik.touched.providedResourceId}
            error={formik.errors.providedResourceId}
          />
        )
      }
      labelCol={{ span: 24 }}
      wrapperCol={{ span: 24 }}
    >
      <Input.TextArea
        name="providedResourceId"
        value={formik.values.providedResourceId}
        onBlur={formik.handleBlur}
        onChange={formik.handleChange}
        placeholder="Enter token provided resource ID"
        disabled={submitResult.loading}
        maxLength={clientAssignedTokenConstants.providedResourceMaxLength}
        autoSize={{ minRows: 2 }}
      />
    </Form.Item>
  );

  const assignedPresetsNode = (
    <Form.Item
      label="Assigned Presets"
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
        workspaceId={workspaceId}
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
          <Form.Item>
            <Typography.Title level={4}>
              Client Assigned Token Form
            </Typography.Title>
          </Form.Item>
          {globalError && (
            <Form.Item>
              <Alert type="error" message={globalError} />
            </Form.Item>
          )}
          {expiresNode}
          {providedResourceIdNode}
          {assignedPresetsNode}
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
