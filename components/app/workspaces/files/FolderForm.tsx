import { css, cx } from "@emotion/css";
import { useRequest } from "ahooks";
import { Button, Form, Input, message, Typography } from "antd";
import { useRouter } from "next/router";
import React from "react";
import { useSWRConfig } from "swr";
import * as yup from "yup";
import FolderAPI from "../../../../lib/api/endpoints/folder";
import { checkEndpointResult } from "../../../../lib/api/utils";
import { fileConstants } from "../../../../lib/definitions/file";
import {
  addRootnameToPath,
  folderConstants,
  IFolder
} from "../../../../lib/definitions/folder";
import {
  AppResourceType,
  appWorkspacePaths,
  systemConstants
} from "../../../../lib/definitions/system";
import useFormHelpers from "../../../../lib/hooks/useFormHelpers";
import { getUseFileListHookKey } from "../../../../lib/hooks/workspaces/useFileList";
import { getUseFolderHookKey } from "../../../../lib/hooks/workspaces/useFolder";
import { messages } from "../../../../lib/messages/messages";
import { fileValidationParts } from "../../../../lib/validation/file";
import { systemValidation } from "../../../../lib/validation/system";
import { formClasses } from "../../../form/classNames";
import FormError from "../../../form/FormError";
import { FormAlert } from "../../../utils/FormAlert";
import {
  IResourcePublicAccessActions,
  resourceListPublicAccessActionsToPublicAccessOps
} from "./FolderPublicAccessOpsInput";

const folderValidation = yup.object().shape({
  name: fileValidationParts.filename.required(messages.fieldIsRequired),
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
  publicAccessOps: IResourcePublicAccessActions[];
}

const initialValues: IFolderFormValues = {
  name: "",
  publicAccessOps: [
    { resourceType: AppResourceType.Folder, actions: [] },
    { resourceType: AppResourceType.File, actions: [] },
  ],
};

function getFolderFormInputFromFolder(item: IFolder): IFolderFormValues {
  const publicAccessOps: IResourcePublicAccessActions[] = [
    { resourceType: AppResourceType.Folder, actions: [] },
    { resourceType: AppResourceType.File, actions: [] },
  ];

  item.publicAccessOps.forEach((publicAccessOp) => {
    const index =
      publicAccessOp.resourceType === AppResourceType.Folder ? 0 : 1;
    publicAccessOps[index].actions.push(publicAccessOp.action);
  });

  return {
    publicAccessOps,
    name: item.name,
    description: item.description,
    maxFileSizeInBytes: item.maxFileSizeInBytes,
  };
}

export interface IFolderFormProps {
  folder?: IFolder;
  className?: string;
  parentId?: string;

  // folder parent path without rootname
  parentPath?: string;
  workspaceId: string;
  workspaceRootname: string;
}

// TODO: show path to parent folder

export default function FolderForm(props: IFolderFormProps) {
  const {
    folder,
    className,
    workspaceId,
    workspaceRootname,
    parentId,
    parentPath,
  } = props;
  const router = useRouter();
  const { mutate } = useSWRConfig();
  const onSubmit = React.useCallback(
    async (data: IFolderFormValues) => {
      let folderId: string | null = null;
      if (folder) {
        const result = await FolderAPI.updateFolder({
          folderId: folder.resourceId,
          folder: {
            description: data.description,
            maxFileSizeInBytes: data.maxFileSizeInBytes,
            publicAccessOps: resourceListPublicAccessActionsToPublicAccessOps(
              data.publicAccessOps
            ),
          },
        });

        checkEndpointResult(result);
        folderId = folder.resourceId;
        message.success("Folder updated");
        mutate(
          getUseFileListHookKey({
            folderId: parentId,
          })
        );

        mutate(
          getUseFolderHookKey({
            folderId: folder.resourceId,
          })
        );
      } else {
        const folderpath = parentPath
          ? `${parentPath}${folderConstants.nameSeparator}${data.name}`
          : data.name;

        const result = await FolderAPI.addFolder({
          folder: {
            folderpath: addRootnameToPath(folderpath, workspaceRootname),
            description: data.description,
            maxFileSizeInBytes: data.maxFileSizeInBytes,
            publicAccessOps: resourceListPublicAccessActionsToPublicAccessOps(
              data.publicAccessOps
            ),
          },
        });

        checkEndpointResult(result);
        folderId = result.folder.resourceId;
        message.success("Folder created");
        mutate(
          getUseFileListHookKey({
            folderId: parentId,
          })
        );
      }

      router.push(appWorkspacePaths.folder(workspaceId, folderId));
    },
    [
      folder,
      parentId,
      workspaceRootname,
      parentPath,
      mutate,
      router,
      workspaceId,
    ]
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

  // const publicAccessOpsNode = (
  //   <Form.Item
  //     label="Public Access Ops"
  //     help={
  //       formik.touched?.publicAccessOps &&
  //       formik.errors?.publicAccessOps && (
  //         <FormError
  //           visible={
  //             isBoolean(formik.touched.publicAccessOps) &&
  //             formik.touched.publicAccessOps
  //           }
  //           error={
  //             isString(formik.errors.publicAccessOps)
  //               ? formik.errors.publicAccessOps
  //               : null
  //           }
  //         />
  //       )
  //     }
  //     labelCol={{ span: 24 }}
  //     wrapperCol={{ span: 24 }}
  //   >
  //     <FolderPublicAccessOpsInput
  //       disabled={submitResult.loading}
  //       value={formik.values.publicAccessOps}
  //       onChange={(update) => formik.setFieldValue("publicAccessOps", update)}
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
          <FormAlert error={submitResult.error} />
          {nameNode}
          {descriptionNode}
          {/* {publicAccessOpsNode} */}
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
