import IconButton from "@/components/utils/buttons/IconButton";
import { StyleableComponentProps } from "@/components/utils/styling/types";
import { systemConstants } from "@/lib/definitions/system";
import { UploadOutlined } from "@ant-design/icons";
import { Button, Form, Input, Space, Upload } from "antd";
import Text from "antd/es/typography/Text";
import { FormikErrors, FormikTouched } from "formik";
import { isArray, isObject, isString } from "lodash-es";
import prettyBytes from "pretty-bytes";
import { SingleFileFormValue } from "./types";
import { getFirstFoldername, replaceBaseFoldername } from "./utils";
import FormError from "@/components/utils/form/FormError.tsx";

export interface SingleFileFormProps extends StyleableComponentProps {
  disabled?: boolean;
  value?: SingleFileFormValue;
  touched?: FormikTouched<SingleFileFormValue>;
  errors?: string | string[] | FormikErrors<SingleFileFormValue>;
  isDirectory?: boolean;
  onChange: (values: Partial<SingleFileFormValue>) => void;
}

const kFileMessages = {
  nameLabel: "File Name",
  invalidNameError: "Name can include the file's extension, e.g image.png",
  namePlaceholder: "Enter file name",
  descriptionLabel: "Description",
  descriptionPlaceholder: "Enter file description",
  existingFileButtonTitle: "Replace File",
  newFileButtonTitle: "Select File",
  autofillText: (name: string) => (
    <Text style={{ textDecoration: "underline", color: "inherit" }}>
      Use <Text strong>{name}</Text> from selected file
    </Text>
  ),
} as const;

export function SingleFileForm(props: SingleFileFormProps) {
  const {
    value: values,
    touched,
    errors,
    disabled,
    style,
    className,
    isDirectory,
    onChange,
  } = props;

  const messages = kFileMessages;

  const nameNode = (
    <Form.Item
      required
      label={messages.nameLabel}
      help={
        touched?.name &&
        isObject(errors) &&
        !isArray(errors) &&
        errors?.name ? (
          <FormError visible={touched.name} error={errors.name} />
        ) : (
          messages.invalidNameError
        )
      }
      labelCol={{ span: 24 }}
      wrapperCol={{ span: 24 }}
    >
      <Space direction="vertical" style={{ width: "100%" }} size={0}>
        <Input
          value={values?.name}
          onChange={(evt) => onChange({ name: evt.target.value })}
          placeholder={messages.namePlaceholder}
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
            <Text style={{ textDecoration: "underline", color: "inherit" }}>
              {messages.autofillText(values.file.name)}
            </Text>
          </Button>
        )}
      </Space>
    </Form.Item>
  );

  const descriptionNode = (
    <Form.Item
      label={messages.descriptionLabel}
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
        placeholder={messages.descriptionPlaceholder}
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
          const existingBaseFoldername =
            isDirectory && values?.name
              ? getFirstFoldername([values])
              : undefined;
          const name = values?.resourceId
            ? values.name
            : isDirectory
            ? file.webkitRelativePath || file.name
            : file.name;

          type ValuesType = [
            Partial<SingleFileFormValue> & Pick<SingleFileFormValue, "name">
          ];
          let newValues: ValuesType = [{ file, name }];

          if (existingBaseFoldername) {
            newValues = replaceBaseFoldername(
              newValues,
              existingBaseFoldername
            ) as ValuesType;
          }

          onChange(newValues[0]);
          return false;
        }}
      >
        <Space size="middle">
          <IconButton
            icon={<UploadOutlined />}
            title={
              values?.file
                ? messages.existingFileButtonTitle
                : messages.newFileButtonTitle
            }
          />
          {values?.file ? (
            <Text type="secondary">{prettyBytes(values.file.size)}</Text>
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
