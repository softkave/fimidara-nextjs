import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Textarea } from "@/components/ui/textarea.tsx";
import { cn } from "@/components/utils.ts";
import styles from "@/components/utils/form/form.module.css";
import FormError from "@/components/utils/form/FormError";
import { FormAlert } from "@/components/utils/FormAlert";
import { agentTokenConstants } from "@/lib/definitions/agentToken";
import { appWorkspacePaths, systemConstants } from "@/lib/definitions/system";
import {
  useWorkspaceAgentTokenAddMutationHook,
  useWorkspaceAgentTokenUpdateMutationHook,
} from "@/lib/hooks/mutationHooks";
import useFormHelpers from "@/lib/hooks/useFormHelpers";
import { css } from "@emotion/css";
import { DatePicker, Form, message } from "antd";
import TextArea from "antd/es/input/TextArea";
import Title from "antd/es/typography/Title";
import dayjs from "dayjs";
import { AgentToken, NewAgentTokenInput } from "fimidara";
import { useRouter } from "next/navigation";
import * as yup from "yup";

const agentTokenValidation = yup.object().shape({
  expires: yup.number(),
  providedResourceId: yup
    .string()
    .max(agentTokenConstants.providedResourceMaxLength)
    .nullable(),
});

const initialValues: NewAgentTokenInput = {
  expires: undefined,
  providedResourceId: undefined,
};

function getAgentTokenFormInputFromToken(item: AgentToken): NewAgentTokenInput {
  return {
    expires: item.expiresAt,
    providedResourceId: item.providedResourceId || undefined,
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
      message.success("Agent token updated");
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
      message.success("Agent token created");
      router.push(
        appWorkspacePaths.agentToken(
          data.body.token.workspaceId,
          data.body.token.resourceId
        )
      );
    },
  });
  const mergedHook = agentToken ? updateHook : createHook;

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

  const nameNode = (
    <Form.Item
      label="Token Name [optional]"
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
        disabled={mergedHook.loading}
        maxLength={systemConstants.maxNameLength}
        autoComplete="off"
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
      <Textarea
        name="description"
        value={formik.values.description}
        onBlur={formik.handleBlur}
        onChange={formik.handleChange}
        placeholder="Enter token description"
        disabled={mergedHook.loading}
        maxLength={systemConstants.maxDescriptionLength}
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
        value={formik.values.expires ? dayjs(formik.values.expires) : undefined}
        onChange={(date) => {
          formik.setFieldValue("expires", date?.valueOf());
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
      <TextArea
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
    <div className={cn(styles.formBody, className)}>
      <div className={styles.formContentWrapper}>
        <form onSubmit={formik.handleSubmit}>
          <Form.Item>
            <Title level={4}>Agent Assigned Token Form</Title>
          </Form.Item>
          <FormAlert error={mergedHook.error} />
          {nameNode}
          {descriptionNode}
          {expiresNode}
          {providedResourceIdNode}
          <Form.Item className={css({ marginTop: "16px" })}>
            <Button type="submit" loading={mergedHook.loading}>
              {agentToken ? "Update Token" : "Create Token"}
            </Button>
          </Form.Item>
        </form>
      </div>
    </div>
  );
}
