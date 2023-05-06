import {
  INewPermissionGroupInput,
  IPermissionGroup,
  permissionGroupPermissionsGroupConstants,
} from "@/lib/definitions/permissionGroups";
import { appWorkspacePaths, systemConstants } from "@/lib/definitions/system";
import {
  useMergeMutationHooksLoadingAndError,
  useWorkspacePermissionGroupAddMutationHook,
  useWorkspacePermissionGroupUpdateMutationHook,
} from "@/lib/hooks/mutationHooks";
import useFormHelpers from "@/lib/hooks/useFormHelpers";
import { messages } from "@/lib/messages/messages";
import { systemValidation } from "@/lib/validation/system";
import { css, cx } from "@emotion/css";
import { Button, Form, Input, Typography, message } from "antd";
import { useRouter } from "next/router";
import * as yup from "yup";
import FormError from "../../../form/FormError";
import { formClasses } from "../../../form/classNames";
import { FormAlert } from "../../../utils/FormAlert";

const permissionGroupValidation = yup.object().shape({
  name: systemValidation.name.required(messages.fieldIsRequired),
  description: systemValidation.description,
  permissionGroups: yup
    .array()
    .max(permissionGroupPermissionsGroupConstants.maxAssignedPermissionGroups),
});

const initialValues: INewPermissionGroupInput = {
  name: "",
  description: "",
  permissionGroups: [],
};

function getPermissionGroupFormInputFromPermissionGroup(
  item: IPermissionGroup
): INewPermissionGroupInput {
  return {
    name: item.name,
    description: item.description,
    permissionGroups: item.permissionGroups.map((item) => ({
      permissionGroupId: item.permissionGroupId,
      order: item.order,
    })),
  };
}

export interface IPermissionGroupFormProps {
  permissionGroup?: IPermissionGroup;
  className?: string;
  workspaceId: string;
}

export default function PermissionGroupForm(props: IPermissionGroupFormProps) {
  const { permissionGroup, className, workspaceId } = props;
  const router = useRouter();
  const updateHook = useWorkspacePermissionGroupUpdateMutationHook({
    onSuccess(data, params) {
      message.success("Permission group updated.");
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
      message.success("Permission group created.");
      router.push(
        appWorkspacePaths.permissionGroup(
          data.body.permissionGroup.workspaceId,
          data.body.permissionGroup.resourceId
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
      label="PermissionGroup Name"
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
            <Typography.Title level={4}>PermissionGroup Form</Typography.Title>
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
