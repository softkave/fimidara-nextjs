import { Textarea } from "@/components/ui/textarea.tsx";
import React from "react";
import { IFormFieldRenderFnProps } from "./FormField";
import { IFormItemInputTextArea } from "./types";

export interface IFormItemInputTextAreaProps
  extends IFormItemInputTextArea,
    IFormFieldRenderFnProps {
  value?: string;
  disabled?: boolean;
  onChange: (v: string) => void;
}

const FormItemInputTextArea: React.FC<IFormItemInputTextAreaProps> = (
  props
) => {
  const {
    value,
    autoFocus,
    disabled,
    maxLength,
    isEditing,
    placeholder,
    style,
    className,
    setEditing,
    onChange,
  } = props;

  return (
    <Textarea
      autoFocus={autoFocus}
      value={value}
      disabled={disabled || !isEditing}
      onChange={(evt) => onChange(evt.target.value)}
      maxLength={maxLength}
      onClick={() => {
        if (!isEditing) setEditing(true);
      }}
      placeholder={placeholder}
      style={style}
      className={className}
    />
  );
};

export default React.memo(FormItemInputTextArea);
