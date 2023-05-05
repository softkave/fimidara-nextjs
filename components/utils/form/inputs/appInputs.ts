import { systemConstants } from "@/lib/definitions/system";
import {
  FormItemInputType,
  IFormItemInputDropdown,
  IFormItemInputText,
  IFormItemInputTextArea,
} from "../types";

const name: IFormItemInputText = {
  type: FormItemInputType.Text,
  maxLength: systemConstants.maxNameLength,
  showCount: true,
};

const description: IFormItemInputTextArea = {
  type: FormItemInputType.TextArea,
  maxLength: systemConstants.maxDescriptionLength,
  showCount: true,
  autoSize: { minRows: 3 },
};

const select: IFormItemInputDropdown = {
  type: FormItemInputType.Dropdown,
  allowClear: true,
};

export const appFormItemInputs = {
  name,
  description,
  select,
};
