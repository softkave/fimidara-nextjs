import { css, cx } from "@emotion/css";
import { Button, Form, Input, message, Typography } from "antd";
import * as yup from "yup";
import React from "react";
import { useRequest } from "ahooks";
import { useRouter } from "next/router";
import { systemValidation } from "../../../../lib/validation/system";
import { messages } from "../../../../lib/messages/messages";
import {
  checkEndpointResult,
  processAndThrowEndpointError,
} from "../../../../lib/api/utils";
import {
  appWorkspacePaths,
  systemConstants,
} from "../../../../lib/definitions/system";
import useFormHelpers from "../../../../lib/hooks/useFormHelpers";
import FormError from "../../../form/FormError";
import { formClasses } from "../../../form/classNames";
import { getUseFolderHookKey } from "../../../../lib/hooks/workspaces/useFolder";
import { IFolder } from "../../../../lib/definitions/folder";
import { useSWRConfig } from "swr";
import FolderAPI from "../../../../lib/api/endpoints/folder";
import { getUseFileListHookKey } from "../../../../lib/hooks/workspaces/useFileList";
import { fileConstants } from "../../../../lib/definitions/file";
import { folderConstants } from "../../../../lib/definitions/folder";
import { FormAlert } from "../../../utils/FormAlert";

const folderValidation = yup.object().shape({
  name: systemValidation.name.required(messages.fieldIsRequired),
  description: systemValidation.description.nullable(),
  maxFileSizeInBytes: yup
    .number()
    .max(fileConstants.maxFileSizeInBytes)
    .nullable(),
});

export interface IFolderFormValues {
  name: string;
  description?: string;
  maxFileSizeInBytes?: number;
}

const initialValues: IFolderFormValues = {
  name: "",
};

function getFolderFormInputFromFolder(item: IFolder): IFolderFormValues {
  return {
    name: item.name,
    description: item.description,
    maxFileSizeInBytes: item.maxFileSizeInBytes,
    // publicAccessOps: item.publicAccessOps.map((op) => ({
    //   action: op.action,
    //   resourceType: op.resourceType,
    // })),
  };
}

export interface IFolderFormProps {
  folder?: IFolder;
  className?: string;
  parentId?: string;
  parentPath?: string;
  workspaceId: string;
}

// TODO: show path to parent folder

export default function FolderForm(props: IFolderFormProps) {
  const { folder, className, workspaceId, parentId, parentPath } = props;
  const router = useRouter();
  const { mutate } = useSWRConfig();
  const onSubmit = React.useCallback(
    async (data: IFolderFormValues) => {
      try {
        let folderId: string | null = null;

        if (folder) {
          const result = await FolderAPI.updateFolder({
            workspaceId: workspaceId,
            folderId: folder.resourceId,
            folder: {
              description: data.description,
              maxFileSizeInBytes: data.maxFileSizeInBytes,
              // publicAccessOps: data.publicAccessOps,
            },
          });

          checkEndpointResult(result);
          folderId = folder.resourceId;
          message.success("Folder updated");
          mutate(
            getUseFileListHookKey({
              workspaceId: workspaceId,
              folderId: parentId,
            })
          );

          mutate(
            getUseFolderHookKey({
              workspaceId: workspaceId,
              folderId: folder.resourceId,
            })
          );
        } else {
          const folderpath = parentPath
            ? `${parentPath}${folderConstants.nameSeparator}${data.name}`
            : data.name;

          const result = await FolderAPI.addFolder({
            workspaceId: workspaceId,
            folder: {
              folderpath,
              description: data.description,
              maxFileSizeInBytes: data.maxFileSizeInBytes,
              // publicAccessOps: data.publicAccessOps,
            },
          });

          checkEndpointResult(result);
          folderId = result.folder.resourceId;
          message.success("Folder created");
          mutate(
            getUseFileListHookKey({
              workspaceId: workspaceId,
              folderId: parentId,
            })
          );
        }

        router.push(appWorkspacePaths.folder(workspaceId, folderId));
      } catch (error) {
        processAndThrowEndpointError(error);
      }
    },
    [folder, workspaceId, parentId, parentPath, mutate, router]
  );

  const submitResult = useRequest(onSubmit, { manual: true });
  const { formik } = useFormHelpers({
    errors: submitResult.error,
    formikProps: {
      validationSchema: folderValidation,
      initialValues: folder
        ? getFolderFormInputFromFolder(folder)
        : initialValues,
      onSubmit: submitResult.run,
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
        disabled={submitResult.loading || !!folder}
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
            <Typography.Title level={4}>Folder Form</Typography.Title>
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
              {folder ? "Update Folder" : "Create Folder"}
            </Button>
          </Form.Item>
        </form>
      </div>
    </div>
  );
}
