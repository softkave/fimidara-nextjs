import { FormAlert } from "@/components/utils/FormAlert";
import { TransferProgressList } from "@/components/utils/TransferProgress";
import CustomIcon from "@/components/utils/buttons/CustomIcon";
import DeleteButton from "@/components/utils/buttons/DeleteButton";
import IconButton from "@/components/utils/buttons/IconButton";
import { StyleableComponentProps } from "@/components/utils/styling/types";
import { addRootnameToPath, folderConstants } from "@/lib/definitions/folder";
import { systemConstants } from "@/lib/definitions/system";
import {
  useWorkspaceFileUpdateMutationHook,
  useWorkspaceFileUploadMutationHook,
} from "@/lib/hooks/mutationHooks";
import useFormHelpers from "@/lib/hooks/useFormHelpers";
import { useTransferProgressHandler } from "@/lib/hooks/useTransferProgress";
import { messages } from "@/lib/messages/messages";
import { indexArray } from "@/lib/utils/indexArray";
import { fileValidationParts } from "@/lib/validation/file";
import { systemValidation } from "@/lib/validation/system";
import { yupObject } from "@/lib/validation/utils";
import { UploadOutlined } from "@ant-design/icons";
import { css, cx } from "@emotion/css";
import {
  Button,
  Collapse,
  Form,
  Input,
  Space,
  Typography,
  Upload,
  message,
} from "antd";
import { RcFile } from "antd/lib/upload";
import { File as FimidaraFile } from "fimidara";
import { FormikErrors, FormikTouched } from "formik";
import { compact, isArray, isObject, isString } from "lodash";
import { useRouter } from "next/router";
import prettyBytes from "pretty-bytes";
import { FiDownload } from "react-icons/fi";
import * as yup from "yup";
import FormError from "../../../form/FormError";
import { formClasses } from "../../../form/classNames";

export type SingleFileFormValue = {
  __localId: string;
  resourceId: string | undefined;
  description?: string;
  encoding?: string;
  mimetype?: string;
  file?: RcFile;
  name: string;
};

export interface FileFormValue {
  files: Array<SingleFileFormValue>;
}

const initialValues: FileFormValue = {
  files: [],
};

function getNewLocalId() {
  return Math.random().toString();
}

function getFileFormInputFromFile(item: FimidaraFile): FileFormValue {
  return {
    files: [
      {
        __localId: getNewLocalId(),
        resourceId: item.resourceId,
        name: item.name,
        description: item.description,
        encoding: item.encoding,
        mimetype: item.mimetype,
      },
    ],
  };
}

const newFileValidationSchema = yupObject<
  Omit<SingleFileFormValue, "__localId" | "resourceId">
>({
  name: fileValidationParts.filename.required(messages.fieldIsRequired),
  description: systemValidation.description.nullable(),
  file: yup.mixed().required(messages.fieldIsRequired),
  encoding: yup.string(),
  mimetype: yup.string(),
});
const existingFileValidationSchema = yupObject<
  Omit<SingleFileFormValue, "__localId" | "resourceId">
>({
  name: fileValidationParts.filename.required(messages.fieldIsRequired),
  description: systemValidation.description.nullable(),
  file: yup.mixed(),
  encoding: yup.string(),
  mimetype: yup.string(),
});
const newFileFormValidationSchema = yupObject<FileFormValue>({
  files: yup.array().of(newFileValidationSchema).min(1).required(),
});
const existingFileFormValidationSchema = yupObject<FileFormValue>({
  files: yup.array().of(existingFileValidationSchema).min(1).required(),
});

const classes = {
  multi: {
    panelHeader: css({ display: "flex" }),
    panelLabel: css({ flex: 1 }),
  },
};

export interface FileFormProps {
  file?: FimidaraFile;
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
      // router.push(
      //   appWorkspacePaths.file(workspaceId, data.body.file.resourceId)
      // );
    },
  });
  const uploadHook = useWorkspaceFileUploadMutationHook({
    onSuccess(data, params) {
      message.success("File uploaded.");
      // router.push(
      //   appWorkspacePaths.file(workspaceId, data.body.file.resourceId)
      // );
    },
    onError(e, params) {
      const filepath = params[0].body.filepath;
      if (filepath) progressHandlerHook.setOpError(filepath, e);
    },
  });
  const mergedHook = file ? updateHook : uploadHook;

  const submitFile = async (input: SingleFileFormValue) => {
    const filepath = addRootnameToPath(
      folderpath
        ? `${folderpath}${folderConstants.nameSeparator}${input.name}`
        : input.name,
      workspaceRootname
    );

    if (input.resourceId) {
      // Existing file

      if (input.file) {
        return await uploadHook.runAsync({
          body: {
            fileId: input.resourceId,
            data: input.file,
            description: input.description,
            mimetype: input.mimetype,
            encoding: input.encoding,
          },
          onUploadProgress: progressHandlerHook.getProgressHandler(filepath),
        });
      } else {
        return await updateHook.runAsync({
          body: {
            fileId: input.resourceId,
            file: {
              description: input.description,
              mimetype: input.mimetype,

              // TODO: add to server
              // encoding: input.encoding,
            },
          },
        });
      }
    } else {
      if (!input.file) {
        // TODO: show error?
        return;
      }

      return await uploadHook.runAsync({
        body: {
          filepath,
          data: input.file,
          description: input.description,
          mimetype: input.mimetype,
          encoding: input.encoding,
        },
        onUploadProgress: progressHandlerHook.getProgressHandler(filepath),
      });
    }
  };

  const { formik } = useFormHelpers({
    errors: mergedHook.error,
    formikProps: {
      validationSchema: file
        ? existingFileFormValidationSchema
        : newFileFormValidationSchema,
      initialValues: file ? getFileFormInputFromFile(file) : initialValues,
      onSubmit: async (data) => {
        await Promise.all(data.files.map(submitFile));
      },
    },
  });

  let contentNode: React.ReactNode = null;

  if (file) {
    const touched = formik.touched?.files ? formik.touched.files[0] : undefined;
    const error = formik.errors?.files ? formik.errors.files[0] : undefined;
    contentNode = (
      <Form.Item
        help={
          touched && isString(error) ? (
            <FormError visible error={error} />
          ) : null
        }
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }}
      >
        <SingleFileForm
          value={formik.values.files[0]}
          touched={touched}
          errors={error}
          disabled={mergedHook.loading}
          onChange={(partialValue) =>
            formik.setValues({
              files: [{ ...formik.values.files[0], ...partialValue }],
            })
          }
        />
      </Form.Item>
    );
  } else {
    contentNode = (
      <Form.Item labelCol={{ span: 24 }} wrapperCol={{ span: 24 }}>
        <MultipleFileForms
          values={formik.values.files}
          disabled={mergedHook.loading}
          errors={formik.errors.files}
          touched={formik.touched.files}
          onChange={(files) => formik.setValues({ files })}
        />
      </Form.Item>
    );
  }

  // TODO: should "uploading files progress" below open the progress drawer on
  // click?
  return (
    <div className={cx(formClasses.formBodyClassName, className)}>
      <div className={formClasses.formContentWrapperClassName}>
        <form onSubmit={formik.handleSubmit}>
          <Form.Item>
            <Typography.Title level={4}>File Form</Typography.Title>
          </Form.Item>
          <FormAlert error={mergedHook.error} />
          {contentNode}
          {progressHandlerHook.identifiers.length > 0 && (
            <Form.Item>
              <Typography.Paragraph type="secondary">
                You can navigate away from this page and track the upload
                progress using the{" "}
                <IconButton
                  disabled
                  icon={<FiDownload />}
                  title={`Uploading files progress button appearance`}
                />{" "}
                <Typography.Text strong>
                  Uploading files progress
                </Typography.Text>{" "}
                button.
              </Typography.Paragraph>
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

export interface MultipleFilesFormProps extends StyleableComponentProps {
  disabled?: boolean;
  values: SingleFileFormValue[];
  touched?: FormikTouched<SingleFileFormValue>[];
  errors?: string | string[] | FormikErrors<SingleFileFormValue[]>;
  onChange: (values: SingleFileFormValue[]) => void;
}

export function MultipleFileForms(props: MultipleFilesFormProps) {
  const { disabled, values, touched, errors, className, style, onChange } =
    props;

  const handleRemoveFile = (index: number) =>
    onChange(values.filter((nextValue, nextIndex) => nextIndex !== index));

  const handleUpdateFile = (
    index: number,
    updatedValue: Partial<SingleFileFormValue>
  ) => {
    const newValues = [...values];
    newValues[index] = { ...newValues[index], ...updatedValue };
    onChange(newValues);
  };

  const panelNodes = values.map((value, index) => (
    <Collapse.Panel
      key={value.__localId}
      header={
        <div className={classes.multi.panelHeader}>
          <Space
            direction="vertical"
            className={classes.multi.panelLabel}
            size={0}
          >
            <Typography.Text>{value.name}</Typography.Text>
            {errors && errors[index] ? (
              <Typography.Text type="danger">
                Entry contains error
              </Typography.Text>
            ) : null}
          </Space>
          <Space size="middle" style={{ marginLeft: "16px" }}>
            {value?.file ? (
              <Typography.Text type="secondary">
                {prettyBytes(value.file.size)}
              </Typography.Text>
            ) : null}
            <DeleteButton onClick={() => handleRemoveFile(index)} />
          </Space>
        </div>
      }
    >
      <SingleFileForm
        key={value.__localId}
        value={value}
        onChange={(updatedValue) => handleUpdateFile(index, updatedValue)}
        disabled={disabled}
        errors={errors && errors[index]}
        touched={touched && touched[index]}
      />
    </Collapse.Panel>
  ));
  const collapseNode = panelNodes.length ? (
    <Form.Item>
      <Collapse>{panelNodes}</Collapse>
    </Form.Item>
  ) : null;

  // TODO: include max file size
  // Only show the default upload button when we're uploading new files
  const selectFileNode = (
    <Form.Item
      // label="Select Files"
      labelCol={{ span: 24 }}
      wrapperCol={{ span: 24 }}
      help={
        touched && isString(errors) ? (
          <FormError visible error={errors} />
        ) : null
      }
    >
      <Upload
        multiple
        showUploadList={false}
        disabled={disabled}
        fileList={compact(values.map((item) => item.file))}
        beforeUpload={(file, fileList) => {
          const existingFilesMap = indexArray(values, {
            indexer(current) {
              return current.file?.uid ?? current.name;
            },
          });
          onChange(
            values.concat(
              fileList
                .filter((file) => !existingFilesMap[file.uid ?? file.name])
                .map(
                  (file): SingleFileFormValue => ({
                    file,
                    __localId: getNewLocalId(),
                    resourceId: undefined,
                    name: file.name,
                    mimetype: file.type,
                  })
                )
            )
          );
          return false;
        }}
      >
        <Button title="Select Files">
          <Space>
            <CustomIcon icon={<UploadOutlined />} />
            Select Files
          </Space>
        </Button>
      </Upload>
    </Form.Item>
  );

  return (
    <div className={cx(className)} style={style}>
      {collapseNode}
      {selectFileNode}
    </div>
  );
}

export interface SingleFileFormProps extends StyleableComponentProps {
  disabled?: boolean;
  value?: SingleFileFormValue;
  touched?: FormikTouched<SingleFileFormValue>;
  errors?: string | string[] | FormikErrors<SingleFileFormValue>;
  onChange: (values: Partial<SingleFileFormValue>) => void;
}

export function SingleFileForm(props: SingleFileFormProps) {
  const {
    value: values,
    touched,
    errors,
    disabled,
    style,
    className,
    onChange,
  } = props;

  const nameNode = (
    <Form.Item
      required
      label="File Name"
      help={
        touched?.name &&
        isObject(errors) &&
        !isArray(errors) &&
        errors?.name ? (
          <FormError visible={touched.name} error={errors.name} />
        ) : (
          "Name can include the file's extension, e.g image.png"
        )
      }
      labelCol={{ span: 24 }}
      wrapperCol={{ span: 24 }}
    >
      <Space direction="vertical" style={{ width: "100%" }} size={0}>
        <Input
          value={values?.name}
          onChange={(evt) => onChange({ name: evt.target.value })}
          placeholder="Enter file name"
          disabled={disabled || !!values?.resourceId}
          maxLength={systemConstants.maxNameLength}
          autoComplete="off"
        />
        {values?.file && (
          <Button
            type="link"
            onClick={() => onChange({ name: values.file?.name })}
            style={{ paddingLeft: 0, paddingRight: 0 }}
          >
            <Typography.Text
              style={{ textDecoration: "underline", color: "inherit" }}
            >
              Autofill from selected file
            </Typography.Text>
          </Button>
        )}
      </Space>
    </Form.Item>
  );

  const descriptionNode = (
    <Form.Item
      label="Description"
      help={
        touched?.description &&
        isObject(errors) &&
        !isArray(errors) &&
        errors?.description && (
          <FormError visible={touched.description} error={errors.description} />
        )
      }
      labelCol={{ span: 24 }}
      wrapperCol={{ span: 24 }}
    >
      <Input.TextArea
        name="description"
        value={values?.description}
        onChange={(evt) => onChange({ description: evt.target.value })}
        placeholder="Enter file description"
        disabled={disabled}
        maxLength={systemConstants.maxDescriptionLength}
        autoSize={{ minRows: 2 }}
      />
    </Form.Item>
  );

  // TODO: include max file size
  const selectFileNode = (
    <Form.Item
      labelCol={{ span: 24 }}
      wrapperCol={{ span: 24 }}
      help={touched && isString(errors) && <FormError visible error={errors} />}
    >
      <Upload
        showUploadList={false}
        multiple={false}
        disabled={disabled}
        fileList={values?.file ? [values.file] : []}
        beforeUpload={(file, fileList) => {
          onChange({ file });
          return false;
        }}
      >
        <Space size="middle">
          <IconButton
            icon={<UploadOutlined />}
            title={values?.file ? "Replace File" : "Select File"}
          />
          {values?.file ? (
            <Typography.Text type="secondary">
              {prettyBytes(values.file.size)}
            </Typography.Text>
          ) : null}
        </Space>
      </Upload>
    </Form.Item>
  );

  // TODO: should "uploading files progress" below open the progress drawer on
  // click?
  return (
    <div className={className} style={style}>
      {nameNode}
      {descriptionNode}
      {selectFileNode}
    </div>
  );
}
