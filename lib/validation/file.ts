import * as yup from "yup";
import { folderConstants } from "../definitions/folder";

const nameRegex = /^[a-zA-Z0-9._-]+[a-zA-Z0-9._\s-/]*$/;
const notNameRegex = /[^a-zA-Z0-9._\s-]/;
const filename = yup
  .string()
  .matches(nameRegex)
  .max(folderConstants.maxFolderNameLength);

export const fileValidationParts = {
  filename,
  nameRegex,
  notNameRegex,
};
