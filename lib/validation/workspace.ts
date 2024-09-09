import { z } from "zod";
import { folderConstants } from "../definitions/folder";

const nameRegex = /^[a-zA-Z0-9._-]+[a-zA-Z0-9._\s-]*$/;
const rootname = z
  .string()
  .regex(nameRegex)
  .max(folderConstants.maxFolderNameLength);

export const workspaceValidationParts = {
  rootname,
};
