import DeleteButton from "@/components/utils/buttons/DeleteButton";
import { StyleableComponentProps } from "@/components/utils/styling/types";
import { css, cx } from "@emotion/css";
import { Collapse, Form, Space } from "antd";
import Text from "antd/es/typography/Text";
import { FormikErrors, FormikTouched } from "formik";
import prettyBytes from "pretty-bytes";
import { SingleFileForm } from "./SingleFileForm";
import { SingleFileFormValue } from "./types";

export interface SelectedFilesFormProps extends StyleableComponentProps {
  disabled?: boolean;
  values: SingleFileFormValue[];
  touched?: FormikTouched<SingleFileFormValue>[];
  errors?: string | string[] | FormikErrors<SingleFileFormValue[]>;
  isDirectory?: boolean;
  onChange: (values: SingleFileFormValue[]) => void;
}

const classes = {
  multi: {
    panelHeader: css({ display: "flex" }),
    panelLabel: css({ flex: 1 }),
  },
};

export function SelectedFilesForm(props: SelectedFilesFormProps) {
  const {
    disabled,
    values,
    touched,
    errors,
    className,
    style,
    isDirectory,
    onChange,
  } = props;

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
            <Text>{value.name}</Text>
            {errors && errors[index] ? (
              <Text type="danger">Entry contains error</Text>
            ) : null}
          </Space>
          <Space size="middle" style={{ marginLeft: "16px" }}>
            {value?.file ? (
              <Text type="secondary">{prettyBytes(value.file.size)}</Text>
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
        isDirectory={isDirectory}
      />
    </Collapse.Panel>
  ));

  const collapseNode = panelNodes.length ? (
    <Form.Item>
      <Collapse>{panelNodes}</Collapse>
    </Form.Item>
  ) : null;

  return (
    <div className={cx(className)} style={style}>
      {collapseNode}
    </div>
  );
}
