import { cn } from "@/components/utils.ts";
import styles from "@/components/utils/form/form.module.css";
import { folderConstants } from "@/lib/definitions/folder";
import { appWorkspacePaths, systemConstants } from "@/lib/definitions/system";
import {
  useWorkspaceAddMutationHook,
  useWorkspaceUpdateMutationHook,
} from "@/lib/hooks/mutationHooks";
import useFormHelpers from "@/lib/hooks/useFormHelpers";
import { messages } from "@/lib/messages/messages";
import { systemValidation } from "@/lib/validation/system";
import { workspaceValidationParts } from "@/lib/validation/workspace";
import { css } from "@emotion/css";
import { Button, Form, Input, Space, message } from "antd";
import Title from "antd/es/typography/Title";
import { AddWorkspaceEndpointParams, Workspace } from "fimidara";
import { useRouter } from "next/navigation";
import * as yup from "yup";
import FormError from "../../utils/form/FormError";
import { FormAlert } from "../../utils/FormAlert";
import { getRootnameFromName } from "./utils";

const workspaceValidation = yup.object().shape({
  name: systemValidation.name.required(messages.fieldIsRequired),
  rootname: workspaceValidationParts.rootname.required(
    messages.fieldIsRequired
  ),
  description: systemValidation.description,
});

const initialValues: AddWorkspaceEndpointParams = {
  name: "",
  rootname: "",
  description: "",
};

function getWorkspaceFormInputFromWorkspace(
  item: Workspace
): AddWorkspaceEndpointParams {
  return {
    name: item.name,
    rootname: item.rootname,
    description: item.description,
  };
}

export interface WorkspaceFormProps {
  workspace?: Workspace;
  className?: string;
}

export default function WorkspaceForm(props: WorkspaceFormProps) {
  const { workspace, className } = props;
  const router = useRouter();
  const updateHook = useWorkspaceUpdateMutationHook({
    onSuccess(data, params) {
      message.success("Workspace updated");
    },
  });
  const createHook = useWorkspaceAddMutationHook({
    onSuccess(data, params) {
      message.success("Workspace created");
      router.push(appWorkspacePaths.folderList(data.body.workspace.resourceId));
    },
  });
  const stateHook = workspace ? updateHook : createHook;

  const { formik } = useFormHelpers({
    errors: stateHook.error,
    formikProps: {
      validationSchema: workspaceValidation,
      initialValues: workspace
        ? getWorkspaceFormInputFromWorkspace(workspace)
        : initialValues,
      onSubmit: (body) =>
        workspace
          ? updateHook.runAsync({
              body: { workspaceId: workspace.resourceId, workspace: body },
            })
          : createHook.runAsync({ body }),
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
        disabled={stateHook.loading}
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
          disabled={stateHook.loading || !!workspace}
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
        disabled={stateHook.loading}
        maxLength={systemConstants.maxDescriptionLength}
        autoSize={{ minRows: 3 }}
      />
    </Form.Item>
  );

  return (
    <div className={cn(styles.formBody, className)}>
      <div className={styles.formContentWrapper}>
        <form onSubmit={formik.handleSubmit}>
          <Form.Item>
            <Title level={4}>Workspace Form</Title>
          </Form.Item>
          <FormAlert error={stateHook.error} />
          {nameNode}
          {rootnameNode}
          {descriptionNode}
          <Form.Item className={css({ marginTop: "16px" })}>
            <Button
              block
              type="primary"
              htmlType="submit"
              loading={stateHook.loading}
            >
              {workspace ? "Update Workspace" : "Create Workspace"}
            </Button>
          </Form.Item>
        </form>
      </div>
    </div>
  );
}
