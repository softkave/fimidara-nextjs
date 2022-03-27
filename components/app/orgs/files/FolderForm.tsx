import { css, cx } from "@emotion/css";
import { Alert, Button, Form, Input, message, Typography } from "antd";
import * as yup from "yup";
import React from "react";
import { useRequest } from "ahooks";
import { useRouter } from "next/router";
import { systemValidation } from "../../../../lib/validation/system";
import { messages } from "../../../../lib/definitions/messages";
import {
  checkEndpointResult,
  processAndThrowEndpointError,
} from "../../../../lib/api/utils";
import {
  appOrgPaths,
  systemConstants,
} from "../../../../lib/definitions/system";
import useFormHelpers from "../../../../lib/hooks/useFormHelpers";
import { getFormError } from "../../../form/formUtils";
import FormError from "../../../form/FormError";
import { formClasses } from "../../../form/classNames";
import { getUseFolderHookKey } from "../../../../lib/hooks/orgs/useFolder";
import { IFolder } from "../../../../lib/definitions/folder";
import { useSWRConfig } from "swr";
import FolderAPI from "../../../../lib/api/endpoints/folder";
import { getUseFileListHookKey } from "../../../../lib/hooks/orgs/useFileList";
import { fileConstants } from "../../../../lib/definitions/file";
import { folderConstants } from "../../../../lib/definitions/folder";

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
  orgId: string;
}

// TODO: show path to parent folder

export default function FolderForm(props: IFolderFormProps) {
  const { folder, className, orgId, parentId, parentPath } = props;
  const router = useRouter();
  const { mutate } = useSWRConfig();
  const onSubmit = React.useCallback(
    async (data: IFolderFormValues) => {
      try {
        let folderId: string | null = null;

        if (folder) {
          const result = await FolderAPI.updateFolder({
            organizationId: orgId,
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
              organizationId: orgId,
              folderId: parentId,
            })
          );

          mutate(
            getUseFolderHookKey({
              organizationId: orgId,
              folderId: folder.resourceId,
            })
          );
        } else {
          const folderPath = parentPath
            ? `${parentPath}${folderConstants.nameSeparator}${data.name}`
            : data.name;

          const result = await FolderAPI.addFolder({
            organizationId: orgId,
            folder: {
              folderPath,
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
              organizationId: orgId,
              folderId: parentId,
            })
          );
        }

        router.push(appOrgPaths.folder(orgId, folderId));
      } catch (error) {
        processAndThrowEndpointError(error);
      }
    },
    [folder, orgId]
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

  const globalError = getFormError(formik.errors);
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

  // const maxFileSizeInBytesNode = (
  //   <Form.Item
  //     label="Max File Size in Bytes"
  //     help={
  //       formik.touched?.maxFileSizeInBytes &&
  //       formik.errors?.maxFileSizeInBytes && (
  //         <FormError
  //           visible={formik.touched.maxFileSizeInBytes}
  //           error={formik.errors.maxFileSizeInBytes}
  //         />
  //       )
  //     }
  //     labelCol={{ span: 24 }}
  //     wrapperCol={{ span: 24 }}
  //   >
  //     <InputNumber
  //       name="maxFileSizeInBytes"
  //       value={formik.values.maxFileSizeInBytes}
  //       onBlur={formik.handleBlur}
  //       onChange={formik.handleChange}
  //       placeholder="Enter max file size"
  //       disabled={submitResult.loading}
  //       max={fileConstants.maxFileSizeInBytes}
  //       style={{ minWidth: "120px" }}
  //     />
  //   </Form.Item>
  // );

  return (
    <div className={cx(formClasses.formBodyClassName, className)}>
      <div className={formClasses.formContentWrapperClassName}>
        <form onSubmit={formik.handleSubmit}>
          <Form.Item>
            <Typography.Title level={4}>Folder Form</Typography.Title>
          </Form.Item>
          {globalError && (
            <Form.Item>
              <Alert type="error" message={globalError} />
            </Form.Item>
          )}
          {nameNode}
          {descriptionNode}
          {/* {maxFileSizeInBytesNode} */}
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
