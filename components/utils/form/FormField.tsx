import { Form, FormItemProps, Space } from "antd";
import { defaultTo } from "lodash-es";
import React from "react";
import CancelButton from "../buttons/CancelButton";
import EditButton from "../buttons/EditButton";
import RetryButton from "../buttons/RetryButton";
import SaveButton from "../buttons/SaveButton";
import Middledot from "../Middledot";
import InlineLoading from "../page/InlineLoading";
import { appStyles } from "../theme";
import { ElementError } from "../types";
import FormFieldError from "./FormFieldError";

export interface IFormFieldRenderFnProps {
  isEditing: boolean;
  setEditing: (editing: boolean) => void;
}

export interface IFormFieldProps {
  defaultEditing?: boolean;
  disabled?: boolean;
  error?: ElementError;
  isSaving?: boolean;

  /** Render without any of the control buttons. */
  excludeButtons?: boolean;
  formItemProps?: FormItemProps;
  extraNode?: React.ReactNode;
  saveError?: string;
  render: (p: IFormFieldRenderFnProps) => React.ReactNode;
  onCancel: () => void;
  onSave: () => void;
  onStartEditing: () => void;
}

const FormField: React.FC<IFormFieldProps> = (props) => {
  const {
    defaultEditing,
    disabled,
    error,
    formItemProps,
    isSaving,
    excludeButtons,
    extraNode,
    saveError,
    render,
    onCancel,
    onSave,
    onStartEditing,
  } = props;

  const [isEditing, setEditing] = React.useState(defaultEditing || false);
  const handleEditing = (editing: boolean) => {
    if (editing) onStartEditing();
    setEditing(editing);
  };

  const handleCancelEditing = () => {
    handleEditing(false);
    onCancel();
  };

  const handleSave = () => {
    handleEditing(false);
    onSave();
  };

  const editingNode = isEditing && !excludeButtons && !isSaving && (
    <Space>
      <SaveButton disabled={disabled || !!error} onClick={handleSave} />
      <CancelButton disabled={disabled} onClick={handleCancelEditing} />
    </Space>
  );

  let startEditingNode: React.ReactNode = null;
  if (!isEditing && !excludeButtons && !isSaving) {
    startEditingNode = (
      <Space>
        <EditButton disabled={disabled} onClick={() => handleEditing(true)} />
      </Space>
    );
  }

  const savingNode = isSaving && <InlineLoading />;
  const errorNode = error && (
    <Space>
      <FormFieldError error={saveError || error} />
      {saveError && <RetryButton disabled={isSaving} onClick={handleSave} />}
    </Space>
  );

  const hasButtonNodes = !!(editingNode || startEditingNode || savingNode);
  const hasExtraNodes = !!(hasButtonNodes || extraNode);
  return (
    <Form.Item
      colon={false}
      labelCol={{ span: 24 }}
      {...defaultTo(formItemProps, {})}
    >
      <Space direction="vertical" style={appStyles.p100} size={4}>
        {render({ isEditing, setEditing: handleEditing })}
        {errorNode}
        {hasExtraNodes && (
          <Space split={<Middledot type="secondary" />}>
            {hasButtonNodes ? (
              <React.Fragment>
                {editingNode}
                {startEditingNode}
                {savingNode}
              </React.Fragment>
            ) : null}
            {extraNode}
          </Space>
        )}
      </Space>
    </Form.Item>
  );
};

export default FormField;
