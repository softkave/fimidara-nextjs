import { css, cx } from "@emotion/css";
import { Button, Form, Input, message, Typography } from "antd";
import * as yup from "yup";
import React from "react";
import { useRequest } from "ahooks";
import { systemValidation } from "../../../lib/validation/system";
import { messages } from "../../../lib/messages/messages";
import {
  INewWorkspaceInput,
  IWorkspace,
} from "../../../lib/definitions/workspace";
import WorkspaceAPI from "../../../lib/api/endpoints/workspace";
import {
  checkEndpointResult,
  processAndThrowEndpointError,
} from "../../../lib/api/utils";
import { useSWRConfig } from "swr";
import { getUseWorkspaceHookKey } from "../../../lib/hooks/workspaces/useWorkspace";
import useFormHelpers from "../../../lib/hooks/useFormHelpers";
import FormError from "../../form/FormError";
import {
  appWorkspacePaths,
  systemConstants,
} from "../../../lib/definitions/system";
import { formClasses } from "../../form/classNames";
import { useRouter } from "next/router";
import { FormAlert } from "../../utils/FormAlert";

const workspaceValidation = yup.object().shape({
  name: systemValidation.name.required(messages.fieldIsRequired),
  description: systemValidation.description,
});

const initialValues: INewWorkspaceInput = { name: "", description: "" };

function getWorkspaceFormInputFromWorkspace(
  item: IWorkspace
): INewWorkspaceInput {
  return {
    name: item.name,
    description: item.description,
  };
}

export interface IWorkspaceFormProps {
  workspace?: IWorkspace;
  className?: string;
}

export default function WorkspaceForm(props: IWorkspaceFormProps) {
  const { workspace, className } = props;
  const router = useRouter();
  const { mutate } = useSWRConfig();
  const onSubmit = React.useCallback(
    async (data: INewWorkspaceInput) => {
      try {
        let workspaceId: string | null = null;

        if (workspace) {
          const result = await WorkspaceAPI.updateWorkspace({
            workspace: data,
            workspaceId: workspace.resourceId,
          });

          checkEndpointResult(result);
          workspaceId = result.workspace.resourceId;
          mutate(
            getUseWorkspaceHookKey(workspace.resourceId),
            result.workspace,
            false
          );
          message.success("Workspace updated");
        } else {
          const result = await WorkspaceAPI.addWorkspace(data);
          checkEndpointResult(result);
          workspaceId = result.workspace.resourceId;
          message.success("Workspace created");
        }

        router.push(`${appWorkspacePaths.workspaces}/${workspaceId}`);
      } catch (error) {
        processAndThrowEndpointError(error);
      }
    },
    [workspace, mutate, router]
  );

  const submitResult = useRequest(onSubmit, { manual: true });
  const { formik } = useFormHelpers({
    errors: submitResult.error,
    formikProps: {
      validationSchema: workspaceValidation,
      initialValues: workspace
        ? getWorkspaceFormInputFromWorkspace(workspace)
        : initialValues,
      onSubmit: submitResult.run,
    },
  });

  const nameNode = (
    <Form.Item
      required
      label="Workspace Name"
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
        placeholder="Enter workspace name"
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
        placeholder="Enter workspace description"
        disabled={submitResult.loading}
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
            <Typography.Title level={4}>Workspace Form</Typography.Title>
          </Form.Item>
          <FormAlert error={submitResult.error} />
          {nameNode}
          {descriptionNode}
          <Form.Item className={css({ marginTop: "16px" })}>
            <Button
              block
              type="primary"
              htmlType="submit"
              loading={submitResult.loading}
            >
              {workspace ? "Update Workspace" : "Create Workspace"}
            </Button>
          </Form.Item>
        </form>
      </div>
    </div>
  );
}
