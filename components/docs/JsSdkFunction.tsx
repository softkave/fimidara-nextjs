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
};

const JsSdkFunction: React.FC<JsSdkFunctionProps> = (props) => {
  const { functionName, params, result, throws } = props;
  const paramsDeclarationNode: React.ReactNode[] = [];
  const paramsNode: React.ReactNode[] = [];
  params?.map((nextParam, index) => {
    if (index) {
      paramsDeclarationNode.push(", ");
      paramsNode.push(<Divider />);
    }

    paramsDeclarationNode.push(
      <span>
        {nextParam.name}: {renderJsonFieldType(nextParam.type, true)}
      </span>
    );
    paramsNode.push(renderFieldType(nextParam.type, nextParam.name));
  });

  return (
    <div>
      <div>
        <Typography.Title
          level={5}
          className={classes.fnDeclaration}
          id={functionName}
        >
          <code>
            {functionName}({paramsDeclarationNode})
          </code>
        </Typography.Title>
      </div>
      <div>
        <Typography.Title level={5}>Parameters</Typography.Title>
        {paramsNode}
      </div>
      {result && (
        <div>
          <Typography.Title level={5}>Result</Typography.Title>
          {renderFieldType(result)}
        </div>
      )}
      {throws && (
        <div>
          <Typography.Title level={5}>Throws</Typography.Title>
          {renderFieldType(throws)}
        </div>
      )}
    </div>
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
          {name && <code>{name}</code>}
          <code>{node}</code>
          {nextParam.required ? <code>Required</code> : <code>Optional</code>}
        </Space>
        <FieldDescription fieldbase={nextParam} />
      </div>
    );
  }
}
