import { fileValidationParts } from "@/lib/validation/file";
import { systemValidation } from "@/lib/validation/system";
import { z } from "zod";

export const newFileValidationSchema = z.object({
  name: fileValidationParts.filename.min(1),
  description: systemValidation.description.nullable().optional(),
  file: z.any(),
  encoding: z.string().optional(),
  mimetype: z.string().optional(),
  resourceId: z.string().optional(),
  __localId: z.string(),
});

export const fileFormValidationSchema = z.object({
  files: z.array(newFileValidationSchema).min(1),
});
