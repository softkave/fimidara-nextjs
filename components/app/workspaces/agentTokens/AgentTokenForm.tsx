import { formClasses } from "@/components/form/classNames";
import FormError from "@/components/form/FormError";
import { FormAlert } from "@/components/utils/FormAlert";
import {
  agentTokenConstants,
  INewAgentTokenInput,
} from "@/lib/definitions/agentToken";
import { appWorkspacePaths } from "@/lib/definitions/system";
import {
  useMergeMutationHooksLoadingAndError,
  useWorkspaceAgentTokenAddMutationHook,
  useWorkspaceAgentTokenUpdateMutationHook,
} from "@/lib/hooks/mutationHooks";
import useFormHelpers from "@/lib/hooks/useFormHelpers";
import { css, cx } from "@emotion/css";
import { Button, DatePicker, Form, Input, message, Typography } from "antd";
import dayjs from "dayjs";
import { AgentToken } from "fimidara";
import { useRouter } from "next/router";
import * as yup from "yup";

const agentTokenValidation = yup.object().shape({
  expires: yup.string(),
  providedResourceId: yup
    .string()
    .max(agentTokenConstants.providedResourceMaxLength),
});

const initialValues: INewAgentTokenInput = {
  expires: undefined,
  providedResourceId: undefined,
};

function getAgentTokenFormInputFromToken(
  item: AgentToken
): INewAgentTokenInput {
  return {
    expires: item.expires,
    providedResourceId: item.providedResourceId,
  };
}

export interface IAgentTokenFormProps {
  agentToken?: AgentToken;
  className?: string;
  workspaceId: string;
}

export default function AgentTokenForm(props: IAgentTokenFormProps) {
  const { agentToken, className, workspaceId } = props;
  const router = useRouter();
  const updateHook = useWorkspaceAgentTokenUpdateMutationHook({
    onSuccess(data, params) {
      message.success("Agent token updated.");
      router.push(
        appWorkspacePaths.agentToken(
          data.body.token.workspaceId,
          data.body.token.resourceId
        )
      );
    },
  });
  const createHook = useWorkspaceAgentTokenAddMutationHook({
    onSuccess(data, params) {
      message.success("Agent token created.");
      router.push(
        appWorkspacePaths.agentToken(
          data.body.token.workspaceId,
          data.body.token.resourceId
        )
      );
    },
  });
  const mergedHook = useMergeMutationHooksLoadingAndError(
    createHook,
    updateHook
  );

  const { formik } = useFormHelpers({
    errors: mergedHook.error,
    formikProps: {
      validationSchema: agentTokenValidation,
      initialValues: agentToken
        ? getAgentTokenFormInputFromToken(agentToken)
        : initialValues,
      onSubmit: (body) =>
        agentToken
          ? updateHook.runAsync({
              body: { tokenId: agentToken.resourceId, token: body },
            })
          : createHook.runAsync({ body: { workspaceId, token: body } }),
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
        value={formik.values.expires ? dayjs(formik.values.expires) : undefined}
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
        disabled={mergedHook.loading}
        maxLength={agentTokenConstants.providedResourceMaxLength}
        autoSize={{ minRows: 2 }}
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
          <FormAlert error={mergedHook.error} />
          {expiresNode}
          {providedResourceIdNode}
          <Form.Item className={css({ marginTop: "16px" })}>
            <Button
              block
              type="primary"
              htmlType="submit"
              loading={mergedHook.loading}
            >
              {agentToken ? "Update Token" : "Create Token"}
            </Button>
          </Form.Item>
        </form>
      </div>
    </div>
  );
}
