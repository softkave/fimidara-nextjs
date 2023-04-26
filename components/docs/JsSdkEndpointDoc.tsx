import assert from "assert";
import React from "react";
import JsSdkFunction from "./JsSdkFunction";
import {
  FieldBinary,
  FieldCustomType,
  FieldObject,
  FieldString,
  HttpEndpointDefinition,
  HttpEndpointMultipartFormdata,
} from "./types";
import {
  fieldObjectHasRequiredFields,
  isFieldBinary,
  isFieldObject,
  isHttpEndpointMultipartFormdata,
} from "./utils";

export interface JsSdkEndpointDocProps {
  endpoint: HttpEndpointDefinition;
}

const JsSdkEndpointDoc: React.FC<JsSdkEndpointDocProps> = (props) => {
  const { endpoint } = props;

  const basePathname = endpoint.basePathname;
  assert(basePathname);
  const methodName =
    "FimidaraEndpoints" +
    basePathname.replaceAll("/v1", "").replaceAll("/", ".");

  return (
    <JsSdkFunction
      functionName={methodName}
      params={[
        { name: "props", type: getSdkEndpointParams(endpoint.requestBody) },
      ]}
      result={getSdkEndpointResponse(endpoint.responseBody)}
      throws={getSdkEndpointThrows()}
    />
  );
};

export default JsSdkEndpointDoc;

function getSdkEndpointParams(
  params: FieldObject | HttpEndpointMultipartFormdata | undefined
): FieldObject {
  const authToken: FieldString = {
    __id: "FieldString",
    required: false,
    description: "JWT string agent token.",
  };
  const fields: any = {
    authToken: { required: true, data: authToken },
  };
  let isRequired = false;

  if (params) {
    const paramsObject = isFieldObject(params)
      ? params
      : isHttpEndpointMultipartFormdata(params)
      ? params.items
      : undefined;

    if (paramsObject) {
      isRequired = fieldObjectHasRequiredFields(paramsObject);
      fields.body = { required: isRequired, data: paramsObject };
    }
  }

  return {
    __id: "FieldObject",
    required: isRequired,
    description: "",
    name: undefined,
    fields,
  };
}

function getSdkEndpointResponse(
  response: FieldBinary | FieldObject | undefined
): FieldObject {
  const headers: FieldCustomType = {
    __id: "FieldCustomType",
    required: true,
    description: "HTTP response headers.",
    descriptionLink: "https://developer.mozilla.org/en-US/docs/Web/API/Headers",
    name: "Headers",
  };
  const fields: any = { headers: { required: true, data: headers } };
  let isRequired = false;

  if (isFieldObject(response)) {
    fields.body = { required: isRequired, data: response };
  } else if (isFieldBinary(response)) {
    const body: FieldCustomType = {
      __id: "FieldCustomType",
      required: true,
      description: "Fetch response.",
      name: "Response",
      descriptionLink:
        "https://developer.mozilla.org/en-US/docs/Web/API/Response",
    };
    fields.body = { required: isRequired, data: body };
  }

  return {
    fields,
    __id: "FieldObject",
    name: undefined,
  };
}

function getSdkEndpointThrows(): FieldObject {
  const headers: FieldCustomType = {
    __id: "FieldCustomType",
    required: true,
    description: "HTTP response headers.",
    descriptionLink: "https://developer.mozilla.org/en-US/docs/Web/API/Headers",
    name: "Headers",
  };

  return {
    __id: "FieldObject",
    required: true,
    description: "Error thrown, if error is an endpoint error.",
    name: undefined,
    fields: {
      errors: {
        required: true,
        data: {
          __id: "FieldArray",
          description: "Server error list.",
          type: {
            __id: "FieldObject",

            description: "Server error item.",
            name: "FimidaraEndpointErrorItem",
            fields: {
              name: {
                required: true,
                data: {
                  __id: "FieldString",

                  description: "Error name.",
                  example: "ValidationError",
                },
              },
              message: {
                required: true,
                data: {
                  __id: "FieldString",

                  description: "Error message.",
                  example: "filepath is required.",
                },
              },
              field: {
                required: false,
                data: {
                  __id: "FieldString",

                  description:
                    "Offending field when error name is ValidationError.",
                  example: "filepath",
                },
              },
            },
          },
        },
      },
      statusCode: {
        required: true,
        data: {
          __id: "FieldNumber",
          description: "Endpoint HTTP status code.",
          example: 200,
          integer: true,
        },
      },
      statusText: {
        required: false,
        data: {
          __id: "FieldString",

          description: "HTTP endpoint status text.",
          example: "OK",
        },
      },
      headers: { required: true, data: headers },
    },
  };
}
