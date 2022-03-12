import { css, cx } from "@emotion/css";
import { Alert, Button, Form, message, Space, Typography } from "antd";
import * as yup from "yup";
import React from "react";
import { useRequest } from "ahooks";
import { useRouter } from "next/router";
import {
  checkEndpointResult,
  processAndThrowEndpointError,
} from "../../../../lib/api/utils";
import { appOrgPaths } from "../../../../lib/definitions/system";
import useFormHelpers from "../../../../lib/hooks/useFormHelpers";
import { getFormError } from "../../../form/formUtils";
import FormError from "../../../form/FormError";
import { formClasses } from "../../../form/classNames";
import {
  IPresetInput,
  presetPermissionsGroupConstants,
} from "../../../../lib/definitions/presets";
import useCollaborator from "../../../../lib/hooks/orgs/useCollaborator";
import SelectPresetInput from "../permissionGroups/SelectPresetInput";
import { ICollaborator } from "../../../../lib/definitions/user";
import CollaboratorAPI from "../../../../lib/api/endpoints/collaborators";
import { first } from "lodash";

const collaboratorValidation = yup.object().shape({
  presets: yup.array().max(presetPermissionsGroupConstants.maxAssignedPresets),
});

interface ICollaboratorFormValues {
  presets: IPresetInput[];
}

export interface ICollaboratorFormProps {
  className?: string;
  orgId: string;
  collaborator: ICollaborator;
}

export default function CollaboratorForm(props: ICollaboratorFormProps) {
  const { collaborator, className, orgId } = props;
  const router = useRouter();
  const { mutate } = useCollaborator(collaborator?.resourceId);
  const onSubmit = React.useCallback(
    async (data: ICollaboratorFormValues) => {
      try {
        const result = await CollaboratorAPI.updateCollaboratorPresets({
          organizationId: orgId,
          collaboratorId: collaborator.resourceId,
          presets: data.presets,
        });

        checkEndpointResult(result);
        const collaboratorId = result.collaborator.resourceId;
        mutate(result);
        message.success("Collaborator updated");
        router.push(appOrgPaths.collaborator(orgId, collaboratorId));
      } catch (error) {
        processAndThrowEndpointError(error);
      }
    },
    [collaborator, orgId]
  );

  const submitResult = useRequest(onSubmit, { manual: true });
  const { formik } = useFormHelpers({
    errors: submitResult.error,
    formikProps: {
      validationSchema: collaboratorValidation,
      initialValues: {
        presets: first(collaborator.organizations)?.presets || [],
      },
      onSubmit: submitResult.run,
    },
  });

  const globalError = getFormError(formik.errors);
  const nameAndEmailNode = (
    <Form.Item
      required
      label=""
      labelCol={{ span: 24 }}
      wrapperCol={{ span: 24 }}
    >
      <Space direction="vertical">
        <Typography.Text>
          {collaborator.firstName} {collaborator.lastName}
        </Typography.Text>
        <Typography.Text type="secondary">{collaborator.email}</Typography.Text>
      </Space>
    </Form.Item>
  );

  const assignedcollaboratorsNode = (
    <Form.Item
      label="Assigned presets"
      help={
        formik.touched?.presets &&
        formik.errors?.presets && (
          <FormError
            visible={formik.touched.presets as any}
            error={formik.errors.presets as any}
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
          <Typography.Title level={4}>Collaborator Form</Typography.Title>
          {globalError && (
            <Form.Item>
              <Alert type="error" message={globalError} />
            </Form.Item>
          )}
          {nameAndEmailNode}
          {assignedcollaboratorsNode}
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