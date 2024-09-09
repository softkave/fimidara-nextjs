import React from "react";
import { Separator } from "../ui/separator.tsx";
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

const JsSdkFunction: React.FC<JsSdkFunctionProps> = (props) => {
  const { functionName, params, result, throws } = props;

  const paramsNode: React.ReactNode[] = [];
  params?.map((nextParam, index) => {
    if (index) {
      paramsNode.push(<Separator key={`divider-${index}`} />);
    }

    paramsNode.push(renderFieldType(nextParam.type, nextParam.name));
  });

  return (
    <div className={cn("space-y-4")}>
      <h5
        className="inline-block"
        id={functionName}
        style={{ margin: 0 }}
        key="title"
      >
        <code>{functionName}</code>
      </h5>
      <div key="parameters" className="space-y-4">
        <h5>Parameters</h5>
        {paramsNode}
      </div>
      {result && (
        <div key="result" className="space-y-4">
          <h5>Result</h5>
          {renderFieldType(result)}
        </div>
      )}
      {throws && (
        <div key="throws" className="space-y-4">
          <h5>Throws</h5>
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
              <code>{name}</code>
              <span>{htmlCharacterCodes.doubleDash}</span>
            </>
          )}
          <code>{node}</code>
          {nextParam.required ? (
            <>
              <span>{htmlCharacterCodes.doubleDash}</span>
              <code>Required</code>
            </>
          ) : (
            <>
              <span>{htmlCharacterCodes.doubleDash}</span>
              <code>Optional</code>
            </>
          )}
        </div>
        <FieldDescription fieldbase={nextParam} />
      </div>
    );
  }
}
