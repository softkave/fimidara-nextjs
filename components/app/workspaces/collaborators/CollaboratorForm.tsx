import { css, cx } from "@emotion/css";
import { Button, Form, message, Typography } from "antd";
import * as yup from "yup";
import React from "react";
import { useRequest } from "ahooks";
import { useRouter } from "next/router";
import { checkEndpointResult } from "../../../../lib/api/utils";
import { appWorkspacePaths } from "../../../../lib/definitions/system";
import useFormHelpers from "../../../../lib/hooks/useFormHelpers";
import FormError from "../../../form/FormError";
import { formClasses } from "../../../form/classNames";
import {
  IPermissionGroupInput,
  permissionGroupPermissionsGroupConstants,
} from "../../../../lib/definitions/permissionGroups";
import useCollaborator from "../../../../lib/hooks/workspaces/useCollaborator";
import SelectPermissionGroupInput from "../permissionGroups/SelectPermissionGroupInput";
import { ICollaborator } from "../../../../lib/definitions/user";
import CollaboratorAPI from "../../../../lib/api/endpoints/collaborators";
import LabeledNode from "../../../utils/LabeledNode";
import { FormAlert } from "../../../utils/FormAlert";

const collaboratorValidation = yup.object().shape({
  permissionGroups: yup.array().max(permissionGroupPermissionsGroupConstants.maxAssignedPermissionGroups),
});

interface ICollaboratorFormValues {
  permissionGroups: IPermissionGroupInput[];
}

export interface ICollaboratorFormProps {
  className?: string;
  workspaceId: string;
  collaborator: ICollaborator;
}

export default function CollaboratorForm(props: ICollaboratorFormProps) {
  const { collaborator, className, workspaceId } = props;
  const router = useRouter();
  const { mutate } = useCollaborator(workspaceId, collaborator.resourceId);
  const onSubmit = React.useCallback(
    async (data: ICollaboratorFormValues) => {
      const result = await CollaboratorAPI.updateCollaboratorPermissionGroups({
        workspaceId: workspaceId,
        collaboratorId: collaborator.resourceId,
        permissionGroups: data.permissionGroups,
      });

      checkEndpointResult(result);
      const collaboratorId = result.collaborator.resourceId;
      mutate(result);
      message.success("Collaborator updated");
      router.push(appWorkspacePaths.collaborator(workspaceId, collaboratorId));
    },
    [collaborator, workspaceId, mutate, router]
  );

  const submitResult = useRequest(onSubmit, { manual: true });
  const { formik } = useFormHelpers({
    errors: submitResult.error,
    formikProps: {
      validationSchema: collaboratorValidation,
      initialValues: {
        permissionGroups: collaborator.permissionGroups,
      },
      onSubmit: submitResult.run,
    },
  });

  const nameNode = (
    <Form.Item>
      <LabeledNode
        nodeIsText
        label="Name"
        direction="vertical"
        node={collaborator.firstName + " " + collaborator.lastName}
      />
    </Form.Item>
  );

  const emailNode = (
    <Form.Item>
      <LabeledNode
        nodeIsText
        label="Email Address"
        direction="vertical"
        node={collaborator.email}
      />
    </Form.Item>
  );

  const assignedPermissionGroupsNode = (
    <Form.Item
      label="Assigned permission groups"
      help={
        formik.touched?.permissionGroups &&
        formik.errors?.permissionGroups && (
          <FormError
            visible={formik.touched.permissionGroups as any}
            error={formik.errors.permissionGroups as any}
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
            <Typography.Title level={4}>Collaborator Form</Typography.Title>
          </Form.Item>
          <FormAlert error={submitResult.error} />
          {nameNode}
          {emailNode}
          {assignedPermissionGroupsNode}
          <Form.Item className={css({ marginTop: "16px" })}>
            <Button
              block
              type="primary"
              htmlType="submit"
              loading={submitResult.loading}
            >
              {collaborator ? "Update Collaborator" : "Create Collaborator"}
            </Button>
          </Form.Item>
        </form>
      </div>
    </div>
  );
}
