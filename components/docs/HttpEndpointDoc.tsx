import { css } from "@emotion/css";
import { Space, Typography } from "antd";
import React from "react";
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
    <Space
      direction="vertical"
      style={{ width: "100%" }}
      size={48}
      className={classes.root}
    >
      <div>
        <Typography.Title
          copyable
          level={5}
          className={classes.inline}
          style={{ margin: 0 }}
        >
          <code>{endpoint.basePathname}</code>
        </Typography.Title>{" "}
        {htmlCharacterCodes.doubleDash}{" "}
        <Typography.Title
          level={5}
          className={classes.inline}
          style={{ margin: 0 }}
        >
          <code>{endpoint.method}</code>
        </Typography.Title>
      </div>
      <div>
        <Typography.Title level={5} className={classes.header}>
          Path Parameters
        </Typography.Title>
        {endpoint.pathParamaters ? (
          <FieldObjectAsTable hideTitle fieldObject={endpoint.pathParamaters} />
        ) : (
          notApplicableNode
        )}
      </div>
      <div>
        <Typography.Title className={classes.header} level={5}>
          Request Headers
        </Typography.Title>
        {endpoint.requestHeaders ? (
          <FieldObjectAsTable hideTitle fieldObject={endpoint.requestHeaders} />
        ) : (
          notApplicableNode
        )}
      </div>
      <div>
        <Typography.Title className={classes.header} level={5}>
          Request Query
        </Typography.Title>
        {endpoint.query ? (
          <FieldObjectAsTable hideTitle fieldObject={endpoint.query} />
        ) : (
          notApplicableNode
        )}
      </div>
      <div>
        <Typography.Title className={classes.header} level={5}>
          Request Body
        </Typography.Title>
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
        <Typography.Title className={classes.header} level={5}>
          200 {htmlCharacterCodes.doubleDash} Response Headers
        </Typography.Title>
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
        <Typography.Title className={classes.header} level={5}>
          200 {htmlCharacterCodes.doubleDash} Response Body
        </Typography.Title>
        {isFieldObject(endpoint.responseBody) ? (
          <FieldObjectRender fieldObject={endpoint.responseBody} />
        ) : isFieldBinary(endpoint.responseBody) ? (
          <Typography.Text code>binary</Typography.Text>
        ) : (
          notApplicableNode
        )}
      </div>
      <div>
        <Typography.Title className={classes.header} level={5}>
          4XX or 5XX {htmlCharacterCodes.doubleDash} Response Headers
        </Typography.Title>
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
        <Typography.Title className={classes.header} level={5}>
          4XX or 5XX {htmlCharacterCodes.doubleDash} Response Body
        </Typography.Title>
        {endpoint.errorResponseBody ? (
          <FieldObjectRender fieldObject={endpoint.errorResponseBody} />
        ) : (
          notApplicableNode
        )}
      </div>
    </Space>
  );
};

export default HttpEndpointDoc;
