import { FormAlert } from "@/components/utils/FormAlert";
import { NewBackendConfigInput } from "@/lib/definitions/backendConfig";
import { appWorkspacePaths, systemConstants } from "@/lib/definitions/system";
import {
  useWorkspacePermissionGroupAddMutationHook,
  useWorkspacePermissionGroupUpdateMutationHook,
} from "@/lib/hooks/mutationHooks";
import useFormHelpers from "@/lib/hooks/useFormHelpers";
import { messages } from "@/lib/messages/messages";
import { kBackendConfigValidationSchemas } from "@/lib/validation/backendConfig";
import { systemValidation } from "@/lib/validation/system";
import { yupObject } from "@/lib/validation/utils";
import { css, cx } from "@emotion/css";
import { Button, Form, Input, Typography, message } from "antd";
import { FileBackendConfig } from "fimidara";
import { useRouter } from "next/router";
import FormError from "../../../form/FormError";
import { formClasses } from "../../../form/classNames";

const backendConfigValidation = yupObject<NewBackendConfigInput>({
  name: systemValidation.name.required(messages.fieldIsRequired),
  backend: kBackendConfigValidationSchemas.backendType.required(
    messages.fieldIsRequired
  ),
  credentials: kBackendConfigValidationSchemas.credentials.required(
    messages.fieldIsRequired
  ),
  description: systemValidation.description,
});

const initialValues: NewBackendConfigInput = {
  name: "",
  description: "",
  credentials: {},
  backend: "aws-s3",
};

function getBackendConfigFormInputFromBackendConfig(
  item: FileBackendConfig
): NewBackendConfigInput {
  return {
    name: item.name,
    description: item.description,
    credentials: {},
    backend: item.backend,
  };
}

export interface BackendConfigFormProps {
  backendConfig?: FileBackendConfig;
  className?: string;
  workspaceId: string;
}

export default function PermissionGroupForm(props: BackendConfigFormProps) {
  const { backendConfig, className, workspaceId } = props;
  const router = useRouter();
  const updateHook = useWorkspacePermissionGroupUpdateMutationHook({
    onSuccess(data, params) {
      message.success("Permission group updated");
      router.push(
        appWorkspacePaths.permissionGroup(
          data.body.permissionGroup.workspaceId,
          data.body.permissionGroup.resourceId
        )
      );
    },
  });
  const createHook = useWorkspacePermissionGroupAddMutationHook({
    onSuccess(data, params) {
      message.success("Permission group created");
      router.push(
        appWorkspacePaths.permissionGroup(
          data.body.permissionGroup.workspaceId,
          data.body.permissionGroup.resourceId
        )
      );
    },
  });
  const mergedHook = permissionGroup ? updateHook : createHook;

  const { formik } = useFormHelpers({
    errors: mergedHook.error,
    formikProps: {
      validationSchema: permissionGroupValidation,
      initialValues: permissionGroup
        ? getPermissionGroupFormInputFromPermissionGroup(permissionGroup)
        : initialValues,
      onSubmit: (body) =>
        permissionGroup
          ? updateHook.runAsync({
              body: {
                permissionGroupId: permissionGroup.resourceId,
                data: body,
              },
            })
          : createHook.runAsync({
              body: { workspaceId, permissionGroup: body },
            }),
    },
  });

  const nameNode = (
    <Form.Item
      required
      label="Permission Group Name"
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
        placeholder="Enter permission group name"
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
      <Input.TextArea
        name="description"
        value={formik.values.description}
        onBlur={formik.handleBlur}
        onChange={formik.handleChange}
        placeholder="Enter permission group description"
        disabled={mergedHook.loading}
        maxLength={systemConstants.maxDescriptionLength}
        autoSize={{ minRows: 3 }}
      />
    </Form.Item>
  );

  return (
    <div className={cx(formClasses.formBodyClassName, className)}>
      <div className={formClasses.formContentWrapperClassName}>
        <form onSubmit={formik.handleSubmit}>
          <Form.Item>
            <Typography.Title level={4}>Permission Group Form</Typography.Title>
          </Form.Item>
          <FormAlert error={mergedHook.error} />
          {nameNode}
          {descriptionNode}
          <Form.Item className={css({ marginTop: "16px" })}>
            <Button
              block
              type="primary"
              htmlType="submit"
              loading={mergedHook.loading}
            >
              {permissionGroup
                ? "Update Permission Group"
                : "Create Permission Group"}
            </Button>
          </Form.Item>
        </form>
      </div>
    </div>
  );
}
