import { Select } from "antd";
import React from "react";
import { IFormFieldRenderFnProps } from "./FormField";
import { IFormItemInputDropdown } from "./types";

export interface IFormItemInputDropdownProps
  extends IFormItemInputDropdown,
    IFormFieldRenderFnProps {
  value?: string;
  disabled?: boolean;
  onChange: (v: string | string[]) => void;
}

const FormItemInputDropdown: React.FC<IFormItemInputDropdownProps> = (
  props
) => {
  const {
    value,
    autoFocus,
    disabled,
    isEditing,
    allowClear,
    className,
    style,
    mode,
    placeholder,
    setEditing,
    onChange,
  } = props;

  return (
    <Select
      autoFocus={autoFocus}
      value={value}
      disabled={disabled || !isEditing}
      onChange={onChange}
      onClick={() => {
        if (!isEditing) setEditing(true);
      }}
      mode={mode}
      allowClear={allowClear}
      className={className}
      style={style}
      placeholder={placeholder}
    />
  );
};

export default React.memo(FormItemInputDropdown);
