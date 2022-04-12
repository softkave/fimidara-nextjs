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
import { appWorkspacePaths } from "../../../../lib/definitions/system";
import useFormHelpers from "../../../../lib/hooks/useFormHelpers";
import { getFormError } from "../../../form/formUtils";
import FormError from "../../../form/FormError";
import { formClasses } from "../../../form/classNames";
import {
  IPresetInput,
  presetPermissionsGroupConstants,
} from "../../../../lib/definitions/presets";
import useCollaborator from "../../../../lib/hooks/workspaces/useCollaborator";
import SelectPresetInput from "../permissionGroups/SelectPresetInput";
import { ICollaborator } from "../../../../lib/definitions/user";
import CollaboratorAPI from "../../../../lib/api/endpoints/collaborators";
import LabeledNode from "../../../utils/LabeledNode";

const collaboratorValidation = yup.object().shape({
  presets: yup.array().max(presetPermissionsGroupConstants.maxAssignedPresets),
});

interface ICollaboratorFormValues {
  presets: IPresetInput[];
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
      try {
        const result = await CollaboratorAPI.updateCollaboratorPresets({
          workspaceId: workspaceId,
          collaboratorId: collaborator.resourceId,
          presets: data.presets,
        });

        checkEndpointResult(result);
        const collaboratorId = result.collaborator.resourceId;
        mutate(result);
        message.success("Collaborator updated");
        router.push(
          appWorkspacePaths.collaborator(workspaceId, collaboratorId)
        );
      } catch (error) {
        processAndThrowEndpointError(error);
      }
    },
    [collaborator, workspaceId]
  );

  const submitResult = useRequest(onSubmit, { manual: true });
  const { formik } = useFormHelpers({
    errors: submitResult.error,
    formikProps: {
      validationSchema: collaboratorValidation,
      initialValues: {
        presets: collaborator.presets,
      },
      onSubmit: submitResult.run,
    },
  });

  const globalError = getFormError(formik.errors);
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
        workspaceId={workspaceId}
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
          <Form.Item>
            <Typography.Title level={4}>Collaborator Form</Typography.Title>
          </Form.Item>
          {globalError && (
            <Form.Item>
              <Alert type="error" message={globalError} />
            </Form.Item>
          )}
          {nameNode}
          {emailNode}
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
