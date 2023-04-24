import { css } from "@emotion/css";
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

const classes = {
  endpointPath: css({ display: "inline-block" }),
};

const HttpEndpointDoc: React.FC<HttpEndpointDocProps> = (props) => {
  const { endpoint } = props;

  const notApplicableNode = <Typography.Text>Not Applicable</Typography.Text>;
  return (
    <div>
      <div>
        <Typography.Title copyable level={5} className={classes.endpointPath}>
          <code>{endpoint.basePathname}</code>
        </Typography.Title>{" "}
        {htmlCharacterCodes.doubleDash}{" "}
        <Typography.Title level={5} className={classes.endpointPath}>
          <code>{endpoint.method}</code>
        </Typography.Title>
      </div>
      <div>
        <Typography.Title level={5}>Path Parameters</Typography.Title>
        {endpoint.pathParamaters ? (
          <FieldObjectAsTable fieldObject={endpoint.pathParamaters} />
        ) : (
          notApplicableNode
        )}
      </div>
      <div>
        <Typography.Title level={5}>Request Headers</Typography.Title>
        {endpoint.requestHeaders ? (
          <FieldObjectAsTable fieldObject={endpoint.requestHeaders} />
        ) : (
          notApplicableNode
        )}
      </div>
      <div>
        <Typography.Title level={5}>Request Query</Typography.Title>
        {endpoint.query ? (
          <FieldObjectAsTable fieldObject={endpoint.query} />
        ) : (
          notApplicableNode
        )}
      </div>
      <div>
        <Typography.Title level={5}>Request Body</Typography.Title>
        {isFieldObject(endpoint.requestBody) ? (
          <FieldObjectRender fieldObject={endpoint.requestBody} />
        ) : isHttpEndpointMultipartFormdata(endpoint.requestBody) &&
          endpoint.requestBody.items ? (
          <FieldObjectAsTable fieldObject={endpoint.requestBody.items} />
        ) : (
          notApplicableNode
        )}
      </div>
      <div>
        <Typography.Title level={5}>
          200 {htmlCharacterCodes.doubleDash} Response Headers
        </Typography.Title>
        {endpoint.responseHeaders ? (
          <FieldObjectAsTable fieldObject={endpoint.responseHeaders} />
        ) : (
          notApplicableNode
        )}
      </div>
      <div>
        <Typography.Title level={5}>
          200 {htmlCharacterCodes.doubleDash} Response Body
        </Typography.Title>
        {isFieldObject(endpoint.responseBody) ? (
          <FieldObjectRender fieldObject={endpoint.responseBody} />
        ) : isFieldBinary(endpoint.responseBody) ? (
          <code>binary</code>
        ) : (
          notApplicableNode
        )}
      </div>
      <div>
        <Typography.Title level={5}>
          4XX or 5XX {htmlCharacterCodes.doubleDash} Response Headers
        </Typography.Title>
        {endpoint.errorResponseHeaders ? (
          <FieldObjectAsTable fieldObject={endpoint.errorResponseHeaders} />
        ) : (
          notApplicableNode
        )}
      </div>
      <div>
        <Typography.Title level={5}>
          4XX or 5XX {htmlCharacterCodes.doubleDash} Response Body
        </Typography.Title>
        {endpoint.errorResponseBody ? (
          <FieldObjectRender fieldObject={endpoint.errorResponseBody} />
        ) : (
          notApplicableNode
        )}
      </div>
    </div>
  );
};

export default HttpEndpointDoc;
