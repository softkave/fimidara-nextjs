import { AnyObject } from "@/lib/utils/types";
import { FormItemProps, RadioGroupProps, SelectProps } from "antd";
import { FormikErrors, FormikTouched } from "formik";
import React from "react";
import { IFormFieldProps, IFormFieldRenderFnProps } from "./FormField";

/** Record of path -> boolean (true or false for saving or not), and string (for
 * save error). */
export type FormSaving<Values> = {
  [K in keyof Values]?: Values[K] extends any[]
    ? Values[K][number] extends object
      ? FormSaving<Values[K][number]>[]
      : boolean | string
    : Values[K] extends object
    ? FormSaving<Values[K]>
    : boolean | string;
};

export type FormErrors<T extends AnyObject> = FormikErrors<T> & {
  error?: string | string[];
};

export interface IFormBagSavingProps<T extends AnyObject> {
  savingState: FormSaving<T>;
  setFieldSaving: (field: keyof T, state: boolean | string) => void;
}

export interface IFormBagHelpers<T extends AnyObject> {
  setErrors: (errors: FormikErrors<T>) => void;
  setSubmitting: (isSubmitting: boolean) => void;
  setTouched: (touched: FormikTouched<T>, shouldValidate?: boolean) => void;
  setValues: (
    values: React.SetStateAction<T>,
    shouldValidate?: boolean | undefined
  ) => void;
  setFieldValue: (field: keyof T, value: any, shouldValidate?: boolean) => void;
  setFieldError: (field: keyof T, message: string | undefined) => void;
  setFieldTouched: (
    field: keyof T,
    isTouched?: boolean,
    shouldValidate?: boolean
  ) => void;
}

export interface IFormBag<T extends AnyObject>
  extends IFormBagSavingProps<T>,
    IFormBagHelpers<T> {
  values: T;
  touched: FormikTouched<T>;
  isSubmitting: boolean;
  errors: FormErrors<T>;
  handleSubmit: (e?: React.FormEvent<HTMLFormElement> | undefined) => void;
}

export enum FormItemInputType {
  Text = "text",
  TextArea = "textarea",
  Dropdown = "dropdown",
  Radio = "radio",
  // | "checkbox"
  // | "switch"
  // | "number"
  // | "date"
  // | "time";
}

export interface IFormItemInput {
  type: FormItemInputType;
  autoFocus?: boolean;
  disabled?: boolean;
  style?: React.CSSProperties;
  className?: string;

  /** Transform user input from rendered input component to stored value. */
  transformToValue?: (input: any) => any;

  /** Transform stored value to what's passed to rendered input. */
  transformFromValue?: (value: any) => any;
}

export interface IFormItemInputText extends IFormItemInput {
  type: FormItemInputType.Text;
  maxLength?: number;
  showCount?: boolean;
  isPassword?: boolean;

  /** {@see https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete} */
  autoComplete?: string;
  placeholder?: string;
}

export interface IFormItemInputTextArea extends IFormItemInput {
  type: FormItemInputType.TextArea;
  maxLength?: number;
  autoSize?: boolean | { minRows?: number; maxRows?: number };
  showCount?: boolean;
  placeholder?: string;
}

export interface IFormItemInputDropdown
  extends IFormItemInput,
    Pick<SelectProps, "options" | "mode" | "allowClear" | "placeholder"> {
  type: FormItemInputType.Dropdown;
}

export interface IFormItemInputRadio
  extends IFormItemInput,
    Pick<RadioGroupProps, "optionType" | "buttonStyle" | "options"> {
  type: FormItemInputType.Radio;
  direction?: "vertical" | "horizontal";
}

export interface IFormItem<T extends AnyObject>
  extends Pick<
    IFormFieldProps,
    "excludeButtons" | "defaultEditing" | "disabled"
  > {
  hidden?: boolean | ((item: IFormItem<T>, bag: IFormBag<T>) => boolean);
  formItemProps: FormItemProps;
  name: keyof T;
  input?:
    | IFormItemInputText
    | IFormItemInputTextArea
    | IFormItemInputDropdown
    | IFormItemInputRadio;
  render?: (
    item: IFormItem<T>,
    bag: IFormBag<T>,
    formFieldProps: IFormFieldRenderFnProps
  ) => React.ReactNode;
  save?: (item: IFormItem<T>, bag: IFormBag<T>) => void | Promise<void>;
}
