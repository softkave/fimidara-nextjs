import * as yup from "yup";
import { folderConstants } from "../definitions/folder";

const nameRegex = /^[a-zA-Z0-9._-]+[a-zA-Z0-9._\s-]*$/;
const rootname = yup
  .string()
  .matches(nameRegex)
  .max(folderConstants.maxFolderNameLength);

export const workspaceValidationParts = {
  rootname,
};
