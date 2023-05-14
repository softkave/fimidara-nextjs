import { css } from "@emotion/css";
import { Divider, Space, Typography } from "antd";
import React from "react";
import { htmlCharacterCodes } from "../utils/utils";
import FieldDescription from "./FieldDescription";
import { renderJsonFieldType } from "./FieldObjectAsJson";
import FieldObjectRender from "./FieldObjectRender";
import { FieldType } from "./types";
import { isFieldObject, isHttpEndpointMultipartFormdata } from "./utils";

export interface JsSdkFunctionProps {
  functionName: string;
  params?: Array<{ name: string; type: FieldType }>;
  result?: FieldType;
  throws?: FieldType;
}

const classes = {
  fnDeclaration: css({ display: "inline-block" }),
  root: css({
    "& h1, h2, h3, h4, h5": {
      fontWeight: "500 !important",
      fontSize: "15px !important",
    },
  }),
  header: css({
    marginTop: "0px !important",
    marginBottom: "8px !important",
    textDecoration: "underline",
  }),
};

const JsSdkFunction: React.FC<JsSdkFunctionProps> = (props) => {
  const { functionName, params, result, throws } = props;

  const paramsNode: React.ReactNode[] = [];
  params?.map((nextParam, index) => {
    if (index) {
      paramsNode.push(<Divider />);
    }

    paramsNode.push(renderFieldType(nextParam.type, nextParam.name));
  });

  return (
    <Space
      direction="vertical"
      style={{ width: "100%" }}
      size={"large"}
      className={classes.root}
    >
      <div>
        <Typography.Title
          level={5}
          className={classes.fnDeclaration}
          id={functionName}
          style={{ margin: 0 }}
        >
          <code>{functionName}</code>
        </Typography.Title>
      </div>
      <div>
        <Typography.Title level={5} className={classes.header}>
          Parameters
        </Typography.Title>
        {paramsNode}
      </div>
      {result && (
        <div>
          <Typography.Title level={5} className={classes.header}>
            Result
          </Typography.Title>
          {renderFieldType(result)}
        </div>
      )}
      {throws && (
        <div>
          <Typography.Title level={5} className={classes.header}>
            Throws
          </Typography.Title>
          {renderFieldType(throws)}
        </div>
      )}
    </Space>
  );
};

export default JsSdkFunction;

function renderFieldType(nextParam: any, name?: string) {
  if (isFieldObject(nextParam)) {
    return (
      <FieldObjectRender isForJsSdk fieldObject={nextParam} propName={name} />
    );
  } else if (isHttpEndpointMultipartFormdata(nextParam) && nextParam.items) {
    return (
      <FieldObjectRender
        isForJsSdk
        fieldObject={nextParam.items}
        propName={name}
      />
    );
  } else if (nextParam) {
    const node = renderJsonFieldType(nextParam, true);
    return (
      <div>
        <Space split={htmlCharacterCodes.doubleDash}>
          {name && <Typography.Text code>{name}</Typography.Text>}
          <Typography.Text code>{node}</Typography.Text>
          {nextParam.required ? (
            <Typography.Text code>Required</Typography.Text>
          ) : (
            <Typography.Text code>Optional</Typography.Text>
          )}
        </Space>
        <FieldDescription fieldbase={nextParam} />
      </div>
    );
  }
}
