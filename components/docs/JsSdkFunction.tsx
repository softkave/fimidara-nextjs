import { css } from "@emotion/css";
import { Divider } from "antd";
import Text from "antd/es/typography/Text";
import Title from "antd/es/typography/Title";
import React from "react";
import { cn } from "../utils.ts";
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
      paramsNode.push(<Divider key={`divider-${index}`} />);
    }

    paramsNode.push(renderFieldType(nextParam.type, nextParam.name));
  });

  return (
    <div className={cn(classes.root, "space-y-4")}>
      <Title
        level={5}
        className={classes.fnDeclaration}
        id={functionName}
        style={{ margin: 0 }}
        key="title"
      >
        <code>{functionName}</code>
      </Title>
      <div key="parameters">
        <Title level={5} className={classes.header}>
          Parameters
        </Title>
        {paramsNode}
      </div>
      {result && (
        <div key="result">
          <Title level={5} className={classes.header}>
            Result
          </Title>
          {renderFieldType(result)}
        </div>
      )}
      {throws && (
        <div key="throws">
          <Title level={5} className={classes.header}>
            Throws
          </Title>
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
      <FieldObjectRender
        isForJsSdk
        fieldObject={nextParam}
        propName={name}
        key={name}
      />
    );
  } else if (isHttpEndpointMultipartFormdata(nextParam) && nextParam.items) {
    return (
      <FieldObjectRender
        isForJsSdk
        fieldObject={nextParam.items}
        propName={name}
        key={name}
      />
    );
  } else if (nextParam) {
    const node = renderJsonFieldType(nextParam, true);
    return (
      <div key={name}>
        <div className="space-x-2">
          {name && (
            <>
              <Text code>{name}</Text>
              <span>{htmlCharacterCodes.doubleDash}</span>
            </>
          )}
          <Text code>{node}</Text>
          {nextParam.required ? (
            <>
              <span>{htmlCharacterCodes.doubleDash}</span>
              <Text code>Required</Text>
            </>
          ) : (
            <>
              <span>{htmlCharacterCodes.doubleDash}</span>
              <Text code>Optional</Text>
            </>
          )}
        </div>
        <FieldDescription fieldbase={nextParam} />
      </div>
    );
  }
}
