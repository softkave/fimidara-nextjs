import { FileBackendType } from "fimidara";
import * as yup from "yup";
import {
  AWSS3BackendConfig,
  kBackendConfigConstants,
  kBackendConfigType,
} from "../definitions/backendConfig";
import { messages } from "../messages/messages";
import { yupObject } from "./utils";

const awsSecretAccessKeyRegex = /^[A-Za-z0-9/+]+$/;
const awsAccessKeyIdRegex = /^[A-Za-z0-9]+$/;

const backendType = yup.string().oneOf(Object.values(kBackendConfigType));
const awsS3 = yupObject<AWSS3BackendConfig>({
  accessKeyId: yup
    .string()
    .trim()
    .matches(awsAccessKeyIdRegex)
    .length(kBackendConfigConstants.awsAccessKeyIdLength)
    .required(messages.fieldIsRequired),
  secretAccessKey: yup
    .string()
    .matches(awsSecretAccessKeyRegex)
    .length(kBackendConfigConstants.awsSecretAccessKeyLength)
    .required(messages.fieldIsRequired),
  region: yup
    .string()
    .oneOf(kBackendConfigConstants.awsRegions)
    .required(messages.fieldIsRequired),
});

const credentials = yup.object().when("backend", ([type], schema) => {
  switch (type as FileBackendType) {
    case "aws-s3":
      return awsS3;
    default:
      return yup.object().shape({});
  }
});

export const kBackendConfigValidationSchemas = {
  backendType,
  credentials,
};
