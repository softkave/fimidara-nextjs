"use client";

import { css } from "@emotion/css";
import { Typography } from "antd";
import React from "react";
import { cn } from "../utils.ts";
import PageMessage from "../utils/page/PageMessage";
import { htmlCharacterCodes } from "../utils/utils";
import FieldObjectAsTable from "./FieldObjectAsTable";
import FieldObjectRender from "./FieldObjectRender";
import { HttpEndpointDefinition } from "./types";
import {
  isFieldBinary,
  isFieldObject,
  isHttpEndpointMultipartFormdata,
} from "./utils";

const { Title, Text } = Typography;

export interface HttpEndpointDocProps {
  endpoint: HttpEndpointDefinition;
}

const classes = {
  inline: css({ display: "inline-block" }),
  header: css({
    marginTop: "0px !important",
    marginBottom: "8px !important",
    textDecoration: "underline",
  }),
  root: css({
    "& h1, h2, h3, h4, h5": {
      fontWeight: "500 !important",
      fontSize: "15px !important",
    },
  }),
};

const HttpEndpointDoc: React.FC<HttpEndpointDocProps> = (props) => {
  const { endpoint } = props;
  const notApplicableNode = (
    <PageMessage showMessageOnly message="Not Applicable" />
  );

  return (
    <div style={{ width: "100%" }} className={cn(classes.root, "space-y-4")}>
      <div>
        <Title
          copyable
          level={5}
          className={classes.inline}
          style={{ margin: 0 }}
        >
          <code>{endpoint.basePathname}</code>
        </Title>{" "}
        {htmlCharacterCodes.doubleDash}{" "}
        <Title level={5} className={classes.inline} style={{ margin: 0 }}>
          <code>{endpoint.method}</code>
        </Title>
      </div>
      <div>
        <Title level={5} className={classes.header}>
          Path Parameters
        </Title>
        {endpoint.pathParamaters ? (
          <FieldObjectAsTable hideTitle fieldObject={endpoint.pathParamaters} />
        ) : (
          notApplicableNode
        )}
      </div>
      <div>
        <Title className={classes.header} level={5}>
          Request Headers
        </Title>
        {endpoint.requestHeaders ? (
          <FieldObjectAsTable hideTitle fieldObject={endpoint.requestHeaders} />
        ) : (
          notApplicableNode
        )}
      </div>
      <div>
        <Title className={classes.header} level={5}>
          Request Query
        </Title>
        {endpoint.query ? (
          <FieldObjectAsTable hideTitle fieldObject={endpoint.query} />
        ) : (
          notApplicableNode
        )}
      </div>
      <div>
        <Title className={classes.header} level={5}>
          Request Body
        </Title>
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
        <Title className={classes.header} level={5}>
          200 {htmlCharacterCodes.doubleDash} Response Headers
        </Title>
        {endpoint.responseHeaders ? (
          <FieldObjectAsTable
            hideTitle
            fieldObject={endpoint.responseHeaders}
          />
        ) : (
          notApplicableNode
        )}
      </div>
      <div>
        <Title className={classes.header} level={5}>
          200 {htmlCharacterCodes.doubleDash} Response Body
        </Title>
        {isFieldObject(endpoint.responseBody) ? (
          <FieldObjectRender fieldObject={endpoint.responseBody} />
        ) : isFieldBinary(endpoint.responseBody) ? (
          <Text code>binary</Text>
        ) : (
          notApplicableNode
        )}
      </div>
      <div>
        <Title className={classes.header} level={5}>
          4XX or 5XX {htmlCharacterCodes.doubleDash} Response Headers
        </Title>
        {endpoint.errorResponseHeaders ? (
          <FieldObjectAsTable
            hideTitle
            fieldObject={endpoint.errorResponseHeaders}
          />
        ) : (
          notApplicableNode
        )}
      </div>
      <div>
        <Title className={classes.header} level={5}>
          4XX or 5XX {htmlCharacterCodes.doubleDash} Response Body
        </Title>
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
