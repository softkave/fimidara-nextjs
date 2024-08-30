import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Textarea } from "@/components/ui/textarea.tsx";
import styles from "@/components/utils/form/form.module.css";
import FormError from "@/components/utils/form/FormError.tsx";
import { FormAlert } from "@/components/utils/FormAlert";
import { ICollaborationRequestInput } from "@/lib/definitions/collaborationRequest";
import { appWorkspacePaths, systemConstants } from "@/lib/definitions/system";
import {
  useWorkspaceCollaborationRequestAddMutationHook,
  useWorkspaceCollaborationRequestUpdateMutationHook,
} from "@/lib/hooks/mutationHooks";
import useFormHelpers from "@/lib/hooks/useFormHelpers";
import { messages } from "@/lib/messages/messages";
import { systemValidation } from "@/lib/validation/system";
import { signupValidationParts } from "@/lib/validation/user";
import { css, cx } from "@emotion/css";
import { DatePicker, Form, message } from "antd";
import Title from "antd/es/typography/Title";
import dayjs from "dayjs";
import { CollaborationRequestForWorkspace } from "fimidara";
import { useRouter } from "next/navigation";
import * as yup from "yup";

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
  item: CollaborationRequestForWorkspace
): ICollaborationRequestInput {
  return {
    recipientEmail: item.recipientEmail,
    message: item.message,
    expires: item.expiresAt ? new Date(item.expiresAt).valueOf() : undefined,
  };
}

export interface IRequestFormProps {
  request?: CollaborationRequestForWorkspace;
  className?: string;
  workspaceId: string;
}

export default function RequestForm(props: IRequestFormProps) {
  const { request, className, workspaceId } = props;
  const router = useRouter();
  const updateHook = useWorkspaceCollaborationRequestUpdateMutationHook({
    onSuccess(data, params) {
      message.success("Collaboration request updated");
      router.push(
        appWorkspacePaths.request(
          data.body.request.workspaceId,
          data.body.request.resourceId
        )
      );
    },
  });
  const createHook = useWorkspaceCollaborationRequestAddMutationHook({
    onSuccess(data, params) {
      message.success("Collaboration request created");
      router.push(
        appWorkspacePaths.request(
          data.body.request.workspaceId,
          data.body.request.resourceId
        )
      );
    },
  });
  const mergedHook = request ? updateHook : createHook;

  const { formik } = useFormHelpers({
    errors: mergedHook.error,
    formikProps: {
      validationSchema: requestValidation,
      initialValues: request
        ? getRequestFormInputFromRequest(request)
        : initialValues,
      onSubmit: (body) =>
        request
          ? updateHook.runAsync({
              body: {
                requestId: request.resourceId,
                request: {
                  message: body.message,
                  expires: body.expires,
                },
              },
            })
          : createHook.runAsync({
              body: {
                workspaceId,
                request: body,
              },
            }),
    },
  });

  const recipientEmailNode = (
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
        disabled={mergedHook.loading || !!request}
        maxLength={systemConstants.maxNameLength}
        autoComplete="off"
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
      <Textarea
        name="message"
        value={formik.values.message}
        onBlur={formik.handleBlur}
        onChange={formik.handleChange}
        placeholder="Enter request message"
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
        onChange={(date) => formik.setFieldValue("expires", date?.valueOf())}
        placeholder="Request expiration date"
      />
    </Form.Item>
  );

  return (
    <div className={cx(styles.formBody, className)}>
      <div className={styles.formContentWrapper}>
        <form onSubmit={formik.handleSubmit}>
          <Form.Item>
            <Title level={4}>Collaboration Request Form</Title>
          </Form.Item>
          <FormAlert error={mergedHook.error} />
          {recipientEmailNode}
          {messageNode}
          {expiresNode}
          <Form.Item className={css({ marginTop: "16px" })}>
            <Button type="submit" loading={mergedHook.loading}>
              {request ? "Update Request" : "Create Request"}
            </Button>
          </Form.Item>
        </form>
      </div>
    </div>
  );
}
