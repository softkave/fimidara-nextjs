import { css, cx } from "@emotion/css";
import {
  Alert,
  Button,
  Form,
  Input,
  message,
  Space,
  Typography,
  Upload,
} from "antd";
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
import { useSWRConfig } from "swr";
import FileAPI from "../../../../lib/api/endpoints/file";
import { getUseFileListHookKey } from "../../../../lib/hooks/orgs/useFileList";
import {
  IFile,
  UploadFilePublicAccessActions,
} from "../../../../lib/definitions/file";
import { UploadFile } from "antd/lib/upload/interface";
import { UploadOutlined } from "@ant-design/icons";
import { first } from "lodash";
import { IEndpointResultBase } from "../../../../lib/api/types";
import { getUseFileHookKey } from "../../../../lib/hooks/orgs/useFile";

export interface IFileFormValue {
  description?: string;
  encoding?: string;
  extension?: string;
  mimetype?: string;
  data?: Blob;
  file: Array<UploadFile>;
  name: string;
  publicAccessActions?: UploadFilePublicAccessActions;
}

const initialValues: IFileFormValue = {
  name: "",
  file: [],
};

function getFileFormInputFromFile(item: IFile): IFileFormValue {
  return {
    name: item.name,
    description: item.description,
    file: [],
  };
}

export interface IFileFormProps {
  file?: IFile;
  className?: string;
  folderId?: string;
  orgId: string;
}

export default function FileForm(props: IFileFormProps) {
  const { file, className, orgId, folderId } = props;
  const router = useRouter();
  const { mutate } = useSWRConfig();
  const onSubmit = React.useCallback(
    async (data: IFileFormValue) => {
      try {
        let fileId: string | null = null;
        const inputFile = first(data.file);

        if (file) {
          let result: IEndpointResultBase;

          if (inputFile) {
            result = await FileAPI.uploadFile({
              folderId,
              organizationId: orgId,
              name: data.name,
              description: data.description,
              data: inputFile.originFileObj!,
              mimetype: inputFile.type,
            });
          } else {
            result = await FileAPI.updateFileDetails({
              organizationId: orgId,
              fileId: file.resourceId,
              file: {
                description: data.description,
              },
            });
          }

          checkEndpointResult(result);
          fileId = file.resourceId;
          message.success("File updated");
          mutate(getUseFileListHookKey({ folderId, organizationId: orgId }));
          mutate(
            getUseFileHookKey({
              organizationId: orgId,
              fileId: file.resourceId,
            })
          );
        } else {
          if (!inputFile) {
            // TODO: show error
            return;
          }

          const result = await FileAPI.uploadFile({
            folderId,
            organizationId: orgId,
            name: data.name,
            description: data.description,
            data: inputFile.originFileObj!,
            mimetype: inputFile.type,
          });

          checkEndpointResult(result);
          fileId = result.file.resourceId;
          message.success("File created");
          mutate(
            getUseFileListHookKey({
              folderId,
              organizationId: orgId,
            })
          );
        }

        router.push(appOrgPaths.file(orgId, fileId));
      } catch (error) {
        processAndThrowEndpointError(error);
      }
    },
    [file, orgId]
  );

  const submitResult = useRequest(onSubmit, { manual: true });
  const { formik } = useFormHelpers({
    errors: submitResult.error,
    formikProps: {
      validationSchema: yup.object().shape({
        name: systemValidation.name.required(messages.fieldIsRequired),
        description: systemValidation.description.nullable(),
        file: !file
          ? yup.mixed().required(messages.fieldIsRequired)
          : yup.mixed(),
      }),
      initialValues: file ? getFileFormInputFromFile(file) : initialValues,
      onSubmit: submitResult.run,
    },
  });

  const globalError = getFormError(formik.errors);
  const nameNode = (
    <Form.Item
      required
      label="File Name"
      help={
        formik.touched?.name &&
        formik.errors?.name && (
          <FormError visible={formik.touched.name} error={formik.errors.name} />
        )
      }
      labelCol={{ span: 24 }}
      wrapperCol={{ span: 24 }}
    >
      <Space direction="vertical">
        <Input
          name="name"
          value={formik.values.name}
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          placeholder="Enter file name"
          disabled={submitResult.loading || !!file}
          maxLength={systemConstants.maxNameLength}
        />
        {first(formik.values.file) && (
          <Button
            type="text"
            onClick={() => {
              formik.setFieldValue("name", first(formik.values.file)?.fileName);
            }}
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
        fileList={formik.values.file}
        beforeUpload={(file) => {
          formik.setFieldValue("file", file);
          return false;
        }}
        onRemove={() => formik.setFieldValue("file", [])}
      >
        <Button icon={<UploadOutlined />}>Select File</Button>
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
          {globalError && (
            <Form.Item>
              <Alert type="error" message={globalError} />
            </Form.Item>
          )}
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
