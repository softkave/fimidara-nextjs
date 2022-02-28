import * as yup from "yup";
import { systemConstants } from "./system";

const name = yup.string().max(systemConstants.maxNameLength);
const description = yup.string().max(systemConstants.maxDescriptionLength);

export const systemValidation = {
    name,
    description,
};
