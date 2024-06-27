import { messages } from "@/lib/messages/messages";
import { fileValidationParts } from "@/lib/validation/file";
import { systemValidation } from "@/lib/validation/system";
import { yupObject } from "@/lib/validation/utils";
import * as yup from "yup";
import { SingleFileFormValue } from "./types";

export const newFileValidationSchema = yupObject<
  Omit<SingleFileFormValue, "__localId" | "resourceId">
>({
  name: fileValidationParts.filename.required(messages.fieldIsRequired),
  description: systemValidation.description.nullable(),
  file: yup.mixed().required(messages.fieldIsRequired),
  encoding: yup.string(),
  mimetype: yup.string(),
});
