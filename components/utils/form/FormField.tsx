import { Form, FormItemProps } from "antd";
import { defaultTo } from "lodash-es";
import React from "react";
import CancelButton from "../buttons/CancelButton";
import EditButton from "../buttons/EditButton";
import RetryButton from "../buttons/RetryButton";
import SaveButton from "../buttons/SaveButton";
import Middledot from "../Middledot";
import InlineLoading from "../page/InlineLoading";
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
    <div className="space-x-2">
      <SaveButton disabled={disabled || !!error} onClick={handleSave} />
      <CancelButton disabled={disabled} onClick={handleCancelEditing} />
    </div>
  );

  let startEditingNode: React.ReactNode = null;
  if (!isEditing && !excludeButtons && !isSaving) {
    startEditingNode = (
      <div className="space-x-2">
        <EditButton disabled={disabled} onClick={() => handleEditing(true)} />
      </div>
    );
  }

  const savingNode = isSaving && <InlineLoading />;
  const errorNode = error && (
    <div className="space-x-2">
      <FormFieldError error={saveError || error} />
      {saveError && <RetryButton disabled={isSaving} onClick={handleSave} />}
    </div>
  );

  const hasButtonNodes = !!(editingNode || startEditingNode || savingNode);
  const hasExtraNodes = !!(hasButtonNodes || extraNode);
  return (
    <Form.Item
      colon={false}
      labelCol={{ span: 24 }}
      {...defaultTo(formItemProps, {})}
    >
      <div className="space-x-1">
        {render({ isEditing, setEditing: handleEditing })}
        {errorNode}
        {hasExtraNodes && (
          <div>
            {hasButtonNodes ? (
              <React.Fragment>
                {editingNode}
                {startEditingNode}
                {savingNode}
                <Middledot type="secondary" />
              </React.Fragment>
            ) : null}
            {extraNode}
          </div>
        )}
      </div>
    </Form.Item>
  );
};

export default FormField;
