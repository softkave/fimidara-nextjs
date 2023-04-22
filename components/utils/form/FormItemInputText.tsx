import { Input } from "antd";
import React from "react";
import { IFormFieldRenderFnProps } from "./FormField";
import { IFormItemInputText } from "./types";

export interface IFormItemInputTextProps
  extends IFormItemInputText,
    IFormFieldRenderFnProps {
  value?: string;
  disabled?: boolean;
  onChange: (v: string) => void;
}

const FormItemInputText: React.FC<IFormItemInputTextProps> = (props) => {
  const {
    value,
    autoFocus,
    disabled,
    maxLength,
    autoComplete,
    isEditing,
    isPassword,
    placeholder,
    style,
    className,
    setEditing,
    onChange,
  } = props;

  const InputElement = isPassword ? Input.Password : Input;
  return (
    <InputElement
      autoFocus={autoFocus}
      value={value}
      disabled={disabled || !isEditing}
      onChange={(evt) => onChange(evt.target.value)}
      maxLength={maxLength}
      onClick={() => {
        if (!isEditing) setEditing(true);
      }}
      autoComplete={autoComplete}
      placeholder={placeholder}
      style={style}
      className={className}
    />
  );
};

export default React.memo(FormItemInputText);
