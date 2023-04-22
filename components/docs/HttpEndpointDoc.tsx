import { Typography } from "antd";
import React from "react";
import { htmlCharacterCodes } from "../utils/utils";
import FieldObjectAsTable from "./FieldObjectAsTable";
import FieldObjectRender from "./FieldObjectRender";
import { HttpEndpointDefinition } from "./types";
import {
  isFieldBinary,
  isFieldObject,
  isHttpEndpointMultipartFormdata,
} from "./utils";

export interface HttpEndpointDocProps {
  endpoint: HttpEndpointDefinition;
}

const HttpEndpointDoc: React.FC<HttpEndpointDocProps> = (props) => {
  const { endpoint } = props;

  return (
    <div>
      <div>
        <Typography.Text>{endpoint.basePathname}</Typography.Text>
        {htmlCharacterCodes.doubleDash}
        <Typography.Text>{endpoint.method}</Typography.Text>
      </div>
      <div>
        <h4>Path Parameters</h4>
        {endpoint.pathParamaters ? (
          <FieldObjectAsTable fieldObject={endpoint.pathParamaters} />
        ) : (
          "Not Applicable"
        )}
      </div>
      <div>
        <h4>Request Headers</h4>
        {endpoint.requestHeaders ? (
          <FieldObjectAsTable fieldObject={endpoint.requestHeaders} />
        ) : (
          "Not Applicable"
        )}
      </div>
      <div>
        <h4>Request Query</h4>
        {endpoint.query ? (
          <FieldObjectAsTable fieldObject={endpoint.query} />
        ) : (
          "Not Applicable"
        )}
      </div>
      <div>
        <h4>Request Body</h4>
        {isFieldObject(endpoint.requestBody) ? (
          <FieldObjectRender fieldObject={endpoint.requestBody} />
        ) : isHttpEndpointMultipartFormdata(endpoint.requestBody) &&
          endpoint.requestBody.items ? (
          <FieldObjectAsTable fieldObject={endpoint.requestBody.items} />
        ) : (
          "Not Applicable"
        )}
      </div>
      <div>
        <h4>200 ${htmlCharacterCodes.doubleDash} Response Headers</h4>
        {endpoint.responseHeaders ? (
          <FieldObjectAsTable fieldObject={endpoint.responseHeaders} />
        ) : (
          "Not Applicable"
        )}
      </div>
      <div>
        <h4>200 Response Body</h4>
        {isFieldObject(endpoint.responseBody) ? (
          <FieldObjectRender fieldObject={endpoint.responseBody} />
        ) : isFieldBinary(endpoint.responseBody) ? (
          <code>binary</code>
        ) : (
          "Not Applicable"
        )}
      </div>
      <div>
        <h4>4XX or 5XX ${htmlCharacterCodes.doubleDash} Response Headers</h4>
        {endpoint.errorResponseHeaders ? (
          <FieldObjectAsTable fieldObject={endpoint.errorResponseHeaders} />
        ) : (
          "Not Applicable"
        )}
      </div>
      <div>
        <h4>4XX or 5XX ${htmlCharacterCodes.doubleDash} Response Body</h4>
        {endpoint.errorResponseBody ? (
          <FieldObjectAsTable fieldObject={endpoint.errorResponseBody} />
        ) : (
          "Not Applicable"
        )}
      </div>
    </div>
  );
};

export default HttpEndpointDoc;
