import { getPublicFimidaraEndpointsUsingUserToken } from "@/lib/api/fimidaraEndpoints";
import { UploadFilePublicAccessActions } from "@/lib/definitions/file";
import { addRootnameToPath, folderConstants } from "@/lib/definitions/folder";
import { appWorkspacePaths, systemConstants } from "@/lib/definitions/system";
import useFormHelpers from "@/lib/hooks/useFormHelpers";
import { getUseFileHookKey } from "@/lib/hooks/workspaces/useFile";
import { getUseFileListHookKey } from "@/lib/hooks/workspaces/useFileList";
import { messages } from "@/lib/messages/messages";
import { fileValidationParts } from "@/lib/validation/file";
import { systemValidation } from "@/lib/validation/system";
import { UploadOutlined } from "@ant-design/icons";
import { css, cx } from "@emotion/css";
import { useRequest } from "ahooks";
import {
  Button,
  Form,
  Input,
  Space,
  Typography,
  Upload,
  UploadFile,
  message,
} from "antd";
import { File } from "fimidara";
import { first } from "lodash";
import { useRouter } from "next/router";
import React from "react";
import { useSWRConfig } from "swr";
import * as yup from "yup";
import FormError from "../../../form/FormError";
import { formClasses } from "../../../form/classNames";
import { useUserNode } from "../../../hooks/useUserNode";
import { FormAlert } from "../../../utils/FormAlert";
import IconButton from "../../../utils/buttons/IconButton";

export interface FileFormValue {
  description?: string;
  encoding?: string;
  extension?: string;
  mimetype?: string;
  data?: Blob;
  file: Array<UploadFile>;
  name: string;
  publicAccessAction?: UploadFilePublicAccessActions;
}

const initialValues: FileFormValue = {
  name: "",
  file: [],
};

function getFileFormInputFromFile(item: File): FileFormValue {
  return {
    name: item.name,
    description: item.description,
    file: [],
  };
}

export interface FileFormProps {
  file?: File;
  className?: string;
  folderId?: string;

  // file parent folder without rootname
  folderpath?: string;
  workspaceId: string;
  workspaceRootname: string;
}

export default function FileForm(props: FileFormProps) {
  const {
    file,
    className,
    workspaceId,
    folderId,
    folderpath,
    workspaceRootname,
  } = props;
  const router = useRouter();
  const { mutate } = useSWRConfig();
  const { renderedNode: userLoadNode, assertGet: assertGetUserData } =
    useUserNode();
  const onSubmit = React.useCallback(
    async (data: FileFormValue) => {
      const inputFile = first(data.file);
      const endpoints = getPublicFimidaraEndpointsUsingUserToken();
      let resultFile: File | undefined = undefined;

      if (file) {
        if (inputFile) {
          const result = await endpoints.files.uploadFile({
            body: {
              fileId: file.resourceId,
              description: data.description,
              data: inputFile as any,
              mimetype: inputFile.type,
            },
          });
          resultFile = result.body.file;
        } else {
          const result = await endpoints.files.updateFileDetails({
            body: {
              fileId: file.resourceId,
              file: { description: data.description },
            },
          });
          resultFile = result.body.file;
        }

        message.success("File updated.");
      } else {
        if (!inputFile) {
          // TODO: show error
          return;
        }

        const result = await endpoints.files.uploadFile({
          body: {
            filepath: addRootnameToPath(
              folderpath
                ? `${folderpath}${folderConstants.nameSeparator}${data.name}`
                : data.name,
              workspaceRootname
            ),
            description: data.description,
            data: inputFile as any,
            mimetype: inputFile.type,
          },
        });

        resultFile = result.body.file;
        message.success("File uploaded.");
      }

      mutate(getUseFileListHookKey({ folderId }));
      mutate(getUseFileHookKey({ fileId: resultFile.resourceId }));
      router.push(appWorkspacePaths.file(workspaceId, resultFile.resourceId));
    },
    [
      file,
      workspaceId,
      folderId,
      folderpath,
      router,
      workspaceRootname,
      mutate,
      assertGetUserData,
    ]
  );

  const submitResult = useRequest(onSubmit, { manual: true });
  const { formik } = useFormHelpers({
    errors: submitResult.error,
    formikProps: {
      validationSchema: yup.object().shape({
        name: fileValidationParts.filename.required(messages.fieldIsRequired),
        description: systemValidation.description.nullable(),
        file: !file
          ? yup.mixed().required(messages.fieldIsRequired)
          : yup.mixed(),
      }),
      initialValues: file ? getFileFormInputFromFile(file) : initialValues,
      onSubmit: submitResult.run,
    },
  });

  if (userLoadNode) {
    return userLoadNode;
  }

  const nameNode = (
    <Form.Item
      required
      label="File Name"
      help={
        formik.touched?.name && formik.errors?.name ? (
          <FormError visible={formik.touched.name} error={formik.errors.name} />
        ) : (
          "Name can include the file's extension, e.g image.png"
        )
      }
      labelCol={{ span: 24 }}
      wrapperCol={{ span: 24 }}
    >
      <Space direction="vertical" style={{ width: "100%" }}>
        <Input
          name="name"
          value={formik.values.name}
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          placeholder="Enter file name"
          disabled={submitResult.loading || !!file}
          maxLength={systemConstants.maxNameLength}
          autoComplete="off"
        />
        {!file && first(formik.values.file) && (
          <Button
            type="link"
            onClick={() => {
              formik.setFieldValue("name", first(formik.values.file)?.name);
            }}
            style={{ paddingLeft: 0, paddingRight: 0 }}
          >
            Auto-fill from selected file
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
        placeholder="Enter file description"
        disabled={submitResult.loading}
        maxLength={systemConstants.maxDescriptionLength}
        autoSize={{ minRows: 3 }}
      />
    </Form.Item>
  );

  // TODO: include max file size
  const selectFileNode = (
    <Form.Item
      label="Select File"
      labelCol={{ span: 24 }}
      wrapperCol={{ span: 24 }}
    >
      <Upload
        multiple={false}
        fileList={formik.values.file}
        beforeUpload={(file, fileList) => {
          formik.setFieldValue("file", fileList);
          return false;
        }}
        onRemove={() => {
          formik.setFieldValue("file", []);
        }}
      >
        <IconButton
          icon={<UploadOutlined />}
          title={file ? "Replace File" : "Select File"}
        />
      </Upload>
    </Form.Item>
  );

  return (
    <div className={cx(formClasses.formBodyClassName, className)}>
      <div className={formClasses.formContentWrapperClassName}>
        <form onSubmit={formik.handleSubmit}>
          <Form.Item>
            <Typography.Title level={4}>File Form</Typography.Title>
          </Form.Item>
          <FormAlert error={submitResult.error} />
          {nameNode}
          {descriptionNode}
          {selectFileNode}
          <Form.Item className={css({ marginTop: "16px" })}>
            <Button
              block
              type="primary"
              htmlType="submit"
              loading={submitResult.loading}
            >
              {file ? "Update File" : "Create File"}
            </Button>
          </Form.Item>
        </form>
      </div>
    </div>
  );
}
