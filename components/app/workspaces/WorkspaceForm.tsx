import { css, cx } from "@emotion/css";
import { useRequest } from "ahooks";
import { Button, Form, Input, message, Space, Typography } from "antd";
import { useRouter } from "next/router";
import React from "react";
import { useSWRConfig } from "swr";
import * as yup from "yup";
import WorkspaceAPI from "../../../lib/api/endpoints/workspace";
import { checkEndpointResult } from "../../../lib/api/utils";
import { folderConstants } from "../../../lib/definitions/folder";
import {
  appWorkspacePaths,
  systemConstants,
} from "../../../lib/definitions/system";
import {
  INewWorkspaceInput,
  IWorkspace,
} from "../../../lib/definitions/workspace";
import useFormHelpers from "../../../lib/hooks/useFormHelpers";
import { getUseWorkspaceHookKey } from "../../../lib/hooks/workspaces/useWorkspace";
import { messages } from "../../../lib/messages/messages";
import { fileValidationParts } from "../../../lib/validation/file";
import { systemValidation } from "../../../lib/validation/system";
import { formClasses } from "../../form/classNames";
import FormError from "../../form/FormError";
import { FormAlert } from "../../utils/FormAlert";
import { getRootnameFromName } from "./utils";

const workspaceValidation = yup.object().shape({
  name: systemValidation.name.required(messages.fieldIsRequired),
  rootname: fileValidationParts.filename.required(messages.fieldIsRequired),
  description: systemValidation.description,
});

const initialValues: INewWorkspaceInput = {
  name: "",
  rootname: "",
  description: "",
};

function getWorkspaceFormInputFromWorkspace(
  item: IWorkspace
): INewWorkspaceInput {
  return {
    name: item.name,
    rootname: item.rootname,
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

  const rootnameNode = (
    <Form.Item
      required
      label="Workspace Root Name"
      help={
        formik.touched?.rootname && formik.errors?.rootname ? (
          <FormError
            visible={formik.touched.rootname}
            error={formik.errors.rootname}
          />
        ) : (
          "Used for namespacing when working with files and folders. " +
          'For example "my-workspace-root-name/my-folder/my-file.txt"'
        )
      }
      labelCol={{ span: 24 }}
      wrapperCol={{ span: 24 }}
    >
      <Space direction="vertical" style={{ width: "100%" }}>
        <Input
          name="rootname"
          value={formik.values.rootname}
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          placeholder="Enter workspace root name"
          disabled={submitResult.loading || !!workspace}
          maxLength={folderConstants.maxFolderNameLength}
          autoComplete="off"
        />
        {formik.values.name && !workspace && (
          <Button
            type="link"
            onClick={() => {
              formik.setFieldValue(
                "rootname",
                getRootnameFromName(formik.values.name)
              );
            }}
            style={{ paddingLeft: 0, paddingRight: 0 }}
          >
            Auto-fill from workspace name
          </Button>
        )}
      </Space>
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
          {rootnameNode}
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
