import { addRootnameToPath, folderConstants } from "@/lib/definitions/folder";
import { appWorkspacePaths, systemConstants } from "@/lib/definitions/system";
import {
  useMergeMutationHooksLoadingAndError,
  useWorkspaceFolderAddMutationHook,
  useWorkspaceFolderUpdateMutationHook,
} from "@/lib/hooks/mutationHooks";
import useFormHelpers from "@/lib/hooks/useFormHelpers";
import { messages } from "@/lib/messages/messages";
import { fileValidationParts } from "@/lib/validation/file";
import { systemValidation } from "@/lib/validation/system";
import { css, cx } from "@emotion/css";
import { Button, Form, Input, Typography, message } from "antd";
import { Folder } from "fimidara";
import { useRouter } from "next/router";
import * as yup from "yup";
import FormError from "../../../form/FormError";
import { formClasses } from "../../../form/classNames";
import { FormAlert } from "../../../utils/FormAlert";

const folderValidation = yup.object().shape({
  name: fileValidationParts.filename.required(messages.fieldIsRequired),
  description: systemValidation.description.nullable(),
  // maxFileSizeInBytes: yup
  //   .number()
  //   .max(fileConstants.maxFileSizeInBytes)
  //   .nullable(),
});

export interface FolderFormValues {
  name: string;
  description?: string;
}

const initialValues: FolderFormValues = {
  name: "",
};

function getFolderFormInputFromFolder(item: Folder): FolderFormValues {
  return {
    name: item.name,
    description: item.description,
  };
}

export interface FolderFormProps {
  folder?: Folder;
  className?: string;
  parentId?: string;

  /** folder parent path without rootname */
  parentPath?: string;
  workspaceId: string;
  workspaceRootname: string;
}

// TODO: show path to parent folder

export default function FolderForm(props: FolderFormProps) {
  const { folder, className, workspaceId, workspaceRootname, parentPath } =
    props;
  const router = useRouter();
  const updateHook = useWorkspaceFolderUpdateMutationHook({
    onSuccess(data, params) {
      message.success("Folder updated.");
      router.push(
        appWorkspacePaths.folder(workspaceId, data.body.folder.resourceId)
      );
    },
  });
  const createHook = useWorkspaceFolderAddMutationHook({
    onSuccess(data, params) {
      message.success("Folder created.");
      router.push(
        appWorkspacePaths.folder(workspaceId, data.body.folder.resourceId)
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
      validationSchema: folderValidation,
      initialValues: folder
        ? getFolderFormInputFromFolder(folder)
        : initialValues,
      onSubmit: async (data) => {
        if (folder) {
          return updateHook.runAsync({
            body: {
              folderId: folder.resourceId,
              folder: { description: data.description },
            },
          });
        } else {
          const folderpath = parentPath
            ? `${parentPath}${folderConstants.nameSeparator}${data.name}`
            : data.name;

          return createHook.runAsync({
            body: {
              folder: {
                folderpath: addRootnameToPath(folderpath, workspaceRootname),
                description: data.description,
              },
            },
          });
        }
      },
    },
  });

  const nameNode = (
    <Form.Item
      required
      label="Folder Name"
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
        placeholder="Enter folder name"
        disabled={mergedHook.loading || !!folder}
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
        placeholder="Enter folder description"
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
            <Typography.Title level={4}>Folder Form</Typography.Title>
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
              {folder ? "Update Folder" : "Create Folder"}
            </Button>
          </Form.Item>
        </form>
      </div>
    </div>
  );
}
