import { FormAlert } from "@/components/utils/FormAlert";
import { TransferProgressList } from "@/components/utils/TransferProgress";
import IconButton from "@/components/utils/buttons/IconButton";
import { addRootnameToPath, folderConstants } from "@/lib/definitions/folder";
import { appWorkspacePaths, systemConstants } from "@/lib/definitions/system";
import {
  useWorkspaceFileUpdateMutationHook,
  useWorkspaceFileUploadMutationHook,
} from "@/lib/hooks/mutationHooks";
import useFormHelpers from "@/lib/hooks/useFormHelpers";
import { useTransferProgressHandler } from "@/lib/hooks/useTransferProgress";
import { messages } from "@/lib/messages/messages";
import { fileValidationParts } from "@/lib/validation/file";
import { systemValidation } from "@/lib/validation/system";
import { UploadOutlined } from "@ant-design/icons";
import { css, cx } from "@emotion/css";
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
import { File, stringifyFimidaraFileNamePath } from "fimidara";
import { first } from "lodash";
import { useRouter } from "next/router";
import * as yup from "yup";
import FormError from "../../../form/FormError";
import { formClasses } from "../../../form/classNames";

export interface FileFormValue {
  description?: string;
  encoding?: string;
  extension?: string;
  mimetype?: string;
  data?: Blob;
  file: Array<UploadFile>;
  name: string;
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

  /** file parent folder without rootname. */
  folderpath?: string;
  workspaceId: string;
  workspaceRootname: string;
}

export default function FileForm(props: FileFormProps) {
  const { file, className, workspaceId, folderpath, workspaceRootname } = props;
  const router = useRouter();
  const progressHandlerHook = useTransferProgressHandler();
  const updateHook = useWorkspaceFileUpdateMutationHook({
    onSuccess(data, params) {
      message.success("File updated.");
      router.push(
        appWorkspacePaths.file(workspaceId, data.body.file.resourceId)
      );
    },
  });
  const uploadHook = useWorkspaceFileUploadMutationHook({
    onSuccess(data, params) {
      message.success("File uploaded.");
      router.push(
        appWorkspacePaths.file(workspaceId, data.body.file.resourceId)
      );
    },
  });
  const mergedHook = file ? updateHook : uploadHook;

  const { formik } = useFormHelpers({
    errors: mergedHook.error,
    formikProps: {
      validationSchema: yup.object().shape({
        name: fileValidationParts.filename.required(messages.fieldIsRequired),
        description: systemValidation.description.nullable(),
        file: !file
          ? yup.mixed().required(messages.fieldIsRequired)
          : yup.mixed(),
      }),
      initialValues: file ? getFileFormInputFromFile(file) : initialValues,
      onSubmit: async (data) => {
        const inputFile = first(data.file);

        if (file) {
          if (inputFile) {
            return await uploadHook.runAsync({
              body: {
                fileId: file.resourceId,
                description: data.description,
                data: inputFile as any,
                mimetype: inputFile.type,
              },
              onUploadProgress: progressHandlerHook.getProgressHandler(
                stringifyFimidaraFileNamePath(file)
              ),
            });
          } else {
            return await updateHook.runAsync({
              body: {
                fileId: file.resourceId,
                file: { description: data.description },
              },
            });
          }
        } else {
          if (!inputFile) {
            // TODO: show error?
            return;
          }

          const filepath = addRootnameToPath(
            folderpath
              ? `${folderpath}${folderConstants.nameSeparator}${data.name}`
              : data.name,
            workspaceRootname
          );
          return await uploadHook.runAsync({
            body: {
              filepath,
              description: data.description,
              data: inputFile as any,
              mimetype: inputFile.type,
            },
            onUploadProgress: progressHandlerHook.getProgressHandler(filepath),
          });
        }
      },
    },
  });

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
          disabled={mergedHook.loading || !!file}
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
        disabled={mergedHook.loading}
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
          <FormAlert error={mergedHook.error} />
          {nameNode}
          {descriptionNode}
          {selectFileNode}
          {progressHandlerHook.identifiers.length > 0 && (
            <Form.Item>
              <TransferProgressList
                identifiers={progressHandlerHook.identifiers}
              />
            </Form.Item>
          )}
          <Form.Item className={css({ marginTop: "16px" })}>
            <Button
              block
              type="primary"
              htmlType="submit"
              loading={mergedHook.loading}
            >
              {file ? "Update File" : "Upload File"}
            </Button>
          </Form.Item>
        </form>
      </div>
    </div>
  );
}
