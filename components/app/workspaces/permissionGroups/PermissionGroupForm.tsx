import { css, cx } from "@emotion/css";
import { useRequest } from "ahooks";
import { Button, Form, Input, message, Typography } from "antd";
import { useRouter } from "next/router";
import React from "react";
import * as yup from "yup";
import PermissionGroupAPI from "../../../../lib/api/endpoints/permissionGroup";
import { checkEndpointResult } from "../../../../lib/api/utils";
import {
  INewPermissionGroupInput,
  IPermissionGroup,
  permissionGroupPermissionsGroupConstants,
} from "../../../../lib/definitions/permissionGroups";
import {
  appWorkspacePaths,
  systemConstants,
} from "../../../../lib/definitions/system";
import useFormHelpers from "../../../../lib/hooks/useFormHelpers";
import usePermissionGroup from "../../../../lib/hooks/workspaces/usePermissionGroup";
import { messages } from "../../../../lib/messages/messages";
import { systemValidation } from "../../../../lib/validation/system";
import { formClasses } from "../../../form/classNames";
import FormError from "../../../form/FormError";
import { FormAlert } from "../../../utils/FormAlert";
import SelectPermissionGroupInput from "./SelectPermissionGroupInput";

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
  const { mutate } = usePermissionGroup(permissionGroup?.resourceId);
  const onSubmit = React.useCallback(
    async (data: INewPermissionGroupInput) => {
      let permissionGroupId: string | null = null;

      if (permissionGroup) {
        const result = await PermissionGroupAPI.updatePermissionGroup({
          permissionGroup: data,
          permissionGroupId: permissionGroup.resourceId,
        });

        checkEndpointResult(result);
        permissionGroupId = result.permissionGroup.resourceId;
        mutate(result);
        message.success("Permission group updated");
      } else {
        const result = await PermissionGroupAPI.addPermissionGroup({
          workspaceId: workspaceId,
          permissionGroup: data,
        });

        checkEndpointResult(result);
        permissionGroupId = result.permissionGroup.resourceId;
        message.success("Permission group created");
      }

      router.push(
        appWorkspacePaths.permissionGroup(workspaceId, permissionGroupId)
      );
    },
    [permissionGroup, workspaceId, mutate, router]
  );

  const submitResult = useRequest(onSubmit, { manual: true });
  const { formik } = useFormHelpers({
    errors: submitResult.error,
    formikProps: {
      validationSchema: permissionGroupValidation,
      initialValues: permissionGroup
        ? getPermissionGroupFormInputFromPermissionGroup(permissionGroup)
        : initialValues,
      onSubmit: submitResult.run,
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
        disabled={submitResult.loading}
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
        disabled={submitResult.loading}
        maxLength={systemConstants.maxDescriptionLength}
        autoSize={{ minRows: 3 }}
      />
    </Form.Item>
  );

  const assignedPermissionGroupsNode = (
    <Form.Item
      label="Assigned Permission Groups"
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
            <Typography.Title level={4}>PermissionGroup Form</Typography.Title>
          </Form.Item>
          <FormAlert error={submitResult.error} />
          {nameNode}
          {descriptionNode}
          {assignedPermissionGroupsNode}
          <Form.Item className={css({ marginTop: "16px" })}>
            <Button
              block
              type="primary"
              htmlType="submit"
              loading={submitResult.loading}
            >
              {permissionGroup
                ? "Update PermissionGroup"
                : "Create PermissionGroup"}
            </Button>
          </Form.Item>
        </form>
      </div>
    </div>
  );
}
