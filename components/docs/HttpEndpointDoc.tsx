"use client";

import { css } from "@emotion/css";
import React from "react";
import { Separator } from "../ui/separator.tsx";
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

export interface HttpEndpointDocProps {
  endpoint: HttpEndpointDefinition;
}

const classes = {
  root: css({
    "& table": {
      fontFamily: `var(--font-default), -apple-system, BlinkMacSystemFont,
        "Work Sans", "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans",
        sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol",
        "Noto Color Emoji" !important`,
    },
  }),
};

const HttpEndpointDoc: React.FC<HttpEndpointDocProps> = (props) => {
  const { endpoint } = props;
  const notApplicableNode = (
    <PageMessage title="Not Applicable" className="py-4 px-0" />
  );

  return (
    <div style={{ width: "100%" }} className={cn("space-y-8", classes.root)}>
      <div>
        <h5 className="inline-block" style={{ margin: 0 }}>
          <code>{endpoint.basePathname}</code>
        </h5>{" "}
        {htmlCharacterCodes.doubleDash}{" "}
        <h5 className="inline-block" style={{ margin: 0 }}>
          <code>{endpoint.method}</code>
        </h5>
      </div>
      <div className="space-y-4">
        <h5>Path Parameters</h5>
        {endpoint.pathParamaters ? (
          <FieldObjectAsTable fieldObject={endpoint.pathParamaters} />
        ) : (
          notApplicableNode
        )}
      </div>
      <Separator />
      <div className="space-y-4">
        <h5>Request Headers</h5>
        {endpoint.requestHeaders ? (
          <FieldObjectAsTable fieldObject={endpoint.requestHeaders} />
        ) : (
          notApplicableNode
        )}
      </div>
      <Separator />
      <div className="space-y-4">
        <h5>Request Query</h5>
        {endpoint.query ? (
          <FieldObjectAsTable fieldObject={endpoint.query} />
        ) : (
          notApplicableNode
        )}
      </div>
      <Separator />
      <div className="space-y-4">
        <h5>Request Body</h5>
        {isFieldObject(endpoint.requestBody) ? (
          <FieldObjectRender fieldObject={endpoint.requestBody} />
        ) : isHttpEndpointMultipartFormdata(endpoint.requestBody) &&
          endpoint.requestBody.items ? (
          <FieldObjectAsTable fieldObject={endpoint.requestBody.items} />
        ) : (
          notApplicableNode
        )}
      </div>
      <Separator />
      <div className="space-y-4">
        <h5>200 {htmlCharacterCodes.doubleDash} Response Headers</h5>
        {endpoint.responseHeaders ? (
          <FieldObjectAsTable fieldObject={endpoint.responseHeaders} />
        ) : (
          notApplicableNode
        )}
      </div>
      <Separator />
      <div className="space-y-4">
        <h5>200 {htmlCharacterCodes.doubleDash} Response Body</h5>
        {isFieldObject(endpoint.responseBody) ? (
          <FieldObjectRender fieldObject={endpoint.responseBody} />
        ) : isFieldBinary(endpoint.responseBody) ? (
          <code>binary</code>
        ) : (
          notApplicableNode
        )}
      </div>
      <Separator />
      <div className="space-y-4">
        <h5>4XX or 5XX {htmlCharacterCodes.doubleDash} Response Headers</h5>
        {endpoint.errorResponseHeaders ? (
          <FieldObjectAsTable fieldObject={endpoint.errorResponseHeaders} />
        ) : (
          notApplicableNode
        )}
      </div>
      <Separator />
      <div className="space-y-4">
        <h5>4XX or 5XX {htmlCharacterCodes.doubleDash} Response Body</h5>
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
