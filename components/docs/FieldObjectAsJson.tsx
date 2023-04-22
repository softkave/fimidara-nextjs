import { map } from "lodash";
import React from "react";
import FieldDescription from "./FieldDescription";
import { useContainedFieldObjects } from "./hooks";
import { FieldObject } from "./types";
import {
  isFieldArray,
  isFieldBinary,
  isFieldBoolean,
  isFieldDate,
  isFieldNull,
  isFieldNumber,
  isFieldObject,
  isFieldOrCombination,
  isFieldString,
  isFieldUndefined,
} from "./utils";

export interface FieldObjectAsJsonProps {
  fieldObject: FieldObject;
}

const FieldObjectAsJson: React.FC<FieldObjectAsJsonProps> = (props) => {
  const { fieldObject } = props;
  const objectsToProcess = useContainedFieldObjects({ fieldObject });
  const nodes = React.useMemo(() => {
    const nodes: React.ReactNode[] = [];
    objectsToProcess.forEach((nextObject) => {
      nodes.push(renderFieldObjectAsJson(nextObject));
    });

    return nodes;
  }, [objectsToProcess]);

  return <React.Fragment>{nodes}</React.Fragment>;
};

export default FieldObjectAsJson;

export function renderFieldType(data: any): React.ReactNode {
  if (isFieldString(data)) {
    return "string";
  } else if (isFieldNumber(data)) {
    return "number";
  } else if (isFieldBoolean(data)) {
    return "boolean";
  } else if (isFieldNull(data)) {
    return "null";
  } else if (isFieldUndefined(data)) {
    return "undefined";
  } else if (isFieldDate(data)) {
    return "number";
  } else if (isFieldArray(data)) {
    if (!data.type) return "[]";
    const containedTypeNode = renderFieldType(data.type);
    return (
      <span>
        Array{"<"}${containedTypeNode}
        {">"}
      </span>
    );
  } else if (isFieldObject(data)) {
    return <a href={`#${data.name}`}>{data.name}</a>;
  } else if (isFieldOrCombination(data)) {
    if (!data.types) return "";
    return data.types.map(renderFieldType).join(" | ");
  } else if (isFieldBinary(data)) {
    return "binary";
  }

  return "unknown";
}

export function renderFieldComment(data: any): React.ReactNode {
  const node = <FieldDescription fieldbase={data} />;
  return (
    <p>
      /**
      <br />
      {node}
      <br />
      */
    </p>
  );
}

function renderFieldObjectAsJson(nextObject: FieldObject) {
  const rows = map(nextObject.fields, (fieldbase, key) => {
    const keyNode = <span>{key}</span>;
    const typeNode = renderFieldType(fieldbase);
    const commentNode = renderFieldComment(fieldbase);
    return (
      <p>
        {commentNode}
        {keyNode}: {typeNode}
      </p>
    );
  });

  return (
    <div>
      <h5 id={nextObject.name}>{nextObject.name}</h5>
      &#123;
      <br />
      {rows}
      <br />
      &#125;
    </div>
  );
}
