import CustomIcon from "@/components/utils/buttons/CustomIcon";
import { StyleableComponentProps } from "@/components/utils/styling/types";
import { indexArray } from "@/lib/utils/indexArray";
import { UploadOutlined } from "@ant-design/icons";
import { cx } from "@emotion/css";
import { Button, Form, Space, Upload } from "antd";
import { FormikErrors, FormikTouched } from "formik";
import { compact, isString } from "lodash";
import FormError from "../../../form/FormError";
import { SelectedFilesForm } from "./SelectedFilesForm";
import { SingleFileFormValue } from "./types";
import { getNewFileLocalId } from "./utils";

export interface MultipleFilesFormProps extends StyleableComponentProps {
  disabled?: boolean;
  values: SingleFileFormValue[];
  touched?: FormikTouched<SingleFileFormValue>[];
  errors?: string | string[] | FormikErrors<SingleFileFormValue[]>;
  onChange: (values: SingleFileFormValue[]) => void;
}

export function MultipleFilesForm(props: MultipleFilesFormProps) {
  const { disabled, values, touched, errors, className, style, onChange } =
    props;

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
                    __localId: getNewFileLocalId(),
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
      <SelectedFilesForm {...props} />
      {selectFileNode}
    </div>
  );
}
