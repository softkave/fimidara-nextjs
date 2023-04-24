import { css } from "@emotion/css";
import { Typography } from "antd";
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

const classes = {
  jsonRoot: css({ margin: "24px 0px" }),
  jsonEntry: css({
    margin: "4px 16px",
  }),
  jsonContent: css({
    "& *": {
      fontFamily: `'Source Code Pro', monospace !important`,
    },
  }),
  title: css({ margin: "0px 0px 4px 0px !important" }),
};

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
        Array{"<"}
        {containedTypeNode}
        {">"}
      </span>
    );
  } else if (isFieldObject(data)) {
    return <a href={`#${data.name}`}>{data.name}</a>;
  } else if (isFieldOrCombination(data)) {
    if (!data.types) return "";
    return map(data.types, renderFieldType).join(" | ");
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
    const typeNode = renderFieldType(fieldbase.data);
    return (
      <div className={classes.jsonEntry}>
        {keyNode}: {typeNode}
      </div>
    );
  });

  return (
    <div className={classes.jsonRoot}>
      <Typography.Title
        id={nextObject.name}
        level={5}
        className={classes.title}
        type="secondary"
      >
        {nextObject.name}
      </Typography.Title>
      <div className={classes.jsonContent}>
        &#123;
        {rows}
        &#125;
      </div>
    </div>
  );
}
