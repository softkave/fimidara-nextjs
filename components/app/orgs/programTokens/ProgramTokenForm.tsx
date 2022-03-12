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
  INewProgramAccessTokenInput,
  IProgramAccessToken,
} from "../../../../lib/definitions/programAccessToken";
import ProgramAccessTokenAPI from "../../../../lib/api/endpoints/programAccessToken";
import useProgramToken from "../../../../lib/hooks/orgs/useProgramToken";
import SelectPresetInput from "../permissionGroups/SelectPresetInput";

const programTokenValidation = yup.object().shape({
  name: systemValidation.name.required(messages.fieldIsRequired),
  description: systemValidation.description,
  presets: yup.array().max(presetPermissionsGroupConstants.maxAssignedPresets),
});

const initialValues: INewProgramAccessTokenInput = {
  name: "",
  description: "",
  presets: [],
};

export interface IProgramTokenFormProps {
  programToken?: IProgramAccessToken;
  className?: string;
  orgId: string;
}

export default function ProgramTokenForm(props: IProgramTokenFormProps) {
  const { programToken, className, orgId } = props;
  const router = useRouter();
  const { mutate } = useProgramToken(programToken?.resourceId);
  const onSubmit = React.useCallback(
    async (data: INewProgramAccessTokenInput) => {
      try {
        let programTokenId: string | null = null;

        if (programToken) {
          const result = await ProgramAccessTokenAPI.updateToken({
            token: data,
            tokenId: programToken.resourceId,
          });

          checkEndpointResult(result);
          programTokenId = result.token.resourceId;
          mutate(result);
          message.success("Program access token updated");
        } else {
          const result = await ProgramAccessTokenAPI.addToken({
            organizationId: orgId,
            token: data,
          });

          checkEndpointResult(result);
          programTokenId = result.token.resourceId;
          message.success("Program access token created");
        }

        router.push(appOrgPaths.programToken(orgId, programTokenId));
      } catch (error) {
        processAndThrowEndpointError(error);
      }
    },
    [programToken, orgId]
  );

  const submitResult = useRequest(onSubmit, { manual: true });
  const { formik } = useFormHelpers({
    errors: submitResult.error,
    formikProps: {
      validationSchema: programTokenValidation,
      initialValues: programToken || initialValues,
      onSubmit: submitResult.run,
    },
  });

  const globalError = getFormError(formik.errors);
  const nameNode = (
    <Form.Item
      required
      label="Program Access Token Name"
      help={
        formik.touched?.name &&
        formik.errors?.name && (
          <FormError visible={formik.touched.name} error={formik.errors.name} />
        )
      }
      labelCol={{ span: 24 }}
      wrapperCol={{ span: 24 }}
    >
      <Input
        name="name"
        value={formik.values.name}
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

  const assignedprogramTokensNode = (
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
          {assignedprogramTokensNode}
          <Form.Item className={css({ marginTop: "16px" })}>
            <Button
              block
              type="primary"
              htmlType="submit"
              loading={submitResult.loading}
            >
              {programToken ? "Update Token" : "Create Token"}
            </Button>
          </Form.Item>
        </form>
      </div>
    </div>
  );
}
