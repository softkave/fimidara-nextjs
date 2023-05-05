import AgentTokenAPI from "@/lib/api/endpoints/agentToken";
import { checkEndpointResult } from "@/lib/api/utils";
import {
  IAgentToken,
  INewAgentTokenInput,
  agentTokenConstants,
} from "@/lib/definitions/agentToken";
import { permissionGroupPermissionsGroupConstants } from "@/lib/definitions/permissionGroups";
import { appWorkspacePaths } from "@/lib/definitions/system";
import useFormHelpers from "@/lib/hooks/useFormHelpers";
import useAgentToken from "@/lib/hooks/workspaces/useAgentToken";
import { css, cx } from "@emotion/css";
import { useRequest } from "ahooks";
import { Button, DatePicker, Form, Input, Typography, message } from "antd";
import moment from "moment";
import { useRouter } from "next/router";
import React from "react";
import * as yup from "yup";
import FormError from "../../../form/FormError";
import { formClasses } from "../../../form/classNames";
import { FormAlert } from "../../../utils/FormAlert";
import SelectPermissionGroupInput from "../permissionGroups/SelectPermissionGroupInput";

const agentTokenValidation = yup.object().shape({
  expires: yup.string(),
  permissionGroups: yup
    .array()
    .max(permissionGroupPermissionsGroupConstants.maxAssignedPermissionGroups),
  providedResourceId: yup
    .string()
    .max(agentTokenConstants.providedResourceMaxLength),
});

const initialValues: INewAgentTokenInput = {
  expires: undefined,
  permissionGroups: [],
  providedResourceId: undefined,
};

function getAgentTokenFormInputFromToken(
  item: IAgentToken
): INewAgentTokenInput {
  return {
    expires: item.expires,
    providedResourceId: item.providedResourceId,
    permissionGroups: item.permissionGroups.map((item) => ({
      permissionGroupId: item.permissionGroupId,
      order: item.order,
    })),
  };
}

export interface IAgentTokenFormProps {
  agentToken?: IAgentToken;
  className?: string;
  workspaceId: string;
}

export default function AgentTokenForm(props: IAgentTokenFormProps) {
  const { agentToken, className, workspaceId } = props;
  const router = useRouter();
  const { mutate } = useAgentToken(agentToken?.resourceId);
  const onSubmit = React.useCallback(
    async (data: INewAgentTokenInput) => {
      let agentTokenId: string | null = null;

      if (agentToken) {
        const result = await AgentTokenAPI.updateToken({
          token: data,
          tokenId: agentToken.resourceId,
        });

        checkEndpointResult(result);
        agentTokenId = result.token.resourceId;
        mutate(result);
        message.success("Agent assigned token updated");
      } else {
        const result = await AgentTokenAPI.addToken({
          workspaceId: workspaceId,
          token: data,
        });

        checkEndpointResult(result);
        agentTokenId = result.token.resourceId;
        message.success("Agent assigned token created");
      }

      router.push(appWorkspacePaths.agentToken(workspaceId, agentTokenId));
    },
    [agentToken, workspaceId, mutate, router]
  );

  const submitResult = useRequest(onSubmit, { manual: true });
  const { formik } = useFormHelpers({
    errors: submitResult.error,
    formikProps: {
      validationSchema: agentTokenValidation,
      initialValues: agentToken
        ? getAgentTokenFormInputFromToken(agentToken)
        : initialValues,
      onSubmit: submitResult.run,
    },
  });

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
        maxLength={agentTokenConstants.providedResourceMaxLength}
        autoSize={{ minRows: 2 }}
      />
    </Form.Item>
  );

  const assignedPermissionGroupsNode = (
    <Form.Item
      label="Assigned PermissionGroups"
      help={
        formik.touched?.permissionGroups &&
        formik.errors?.permissionGroups && (
          <FormError
            visible={formik.touched.permissionGroups}
            error={formik.errors.permissionGroups}
          />
        )
      }
      labelCol={{ span: 24 }}
      wrapperCol={{ span: 24 }}
    >
      <SelectPermissionGroupInput
        workspaceId={workspaceId}
        value={formik.values.permissionGroups || []}
        disabled={submitResult.loading}
        onChange={(items) => formik.setFieldValue("permissionGroups", items)}
      />
    </Form.Item>
  );

  return (
    <div className={cx(formClasses.formBodyClassName, className)}>
      <div className={formClasses.formContentWrapperClassName}>
        <form onSubmit={formik.handleSubmit}>
          <Form.Item>
            <Typography.Title level={4}>
              Agent Assigned Token Form
            </Typography.Title>
          </Form.Item>
          <FormAlert error={submitResult.error} />
          {expiresNode}
          {providedResourceIdNode}
          {assignedPermissionGroupsNode}
          <Form.Item className={css({ marginTop: "16px" })}>
            <Button
              block
              type="primary"
              htmlType="submit"
              loading={submitResult.loading}
            >
              {agentToken ? "Update Token" : "Create Token"}
            </Button>
          </Form.Item>
        </form>
      </div>
    </div>
  );
}
