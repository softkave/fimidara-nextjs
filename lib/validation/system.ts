import { z } from "zod";
import { systemConstants } from "../definitions/system";

const name = z.string().max(systemConstants.maxNameLength);
const description = z.string().max(systemConstants.maxDescriptionLength);

export const systemValidation = {
  name,
  description,
};
