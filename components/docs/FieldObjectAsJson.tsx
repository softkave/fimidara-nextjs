import { css } from "@emotion/css";
import { Space, Typography } from "antd";
import { forEach, map } from "lodash";
import React from "react";
import { htmlCharacterCodes } from "../utils/utils";
import FieldDescription from "./FieldDescription";
import { useContainedFieldObjects } from "./hooks";
import { FieldObject } from "./types";
import {
  isFieldArray,
  isFieldBinary,
  isFieldBoolean,
  isFieldCustomType,
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
  propName?: string;
  isForJsSdk?: boolean;
}

const classes = {
  jsonRoot: css({ margin: "24px 0px" }),
  jsonEntry: css({
    margin: "4px 24px",
  }),
  jsonContent: css({
    "& *": {
      fontFamily: `'Source Code Pro', monospace !important`,
    },
  }),
  title: css({ margin: "0px 0px 4px 0px !important" }),
};

const FieldObjectAsJson: React.FC<FieldObjectAsJsonProps> = (props) => {
  const { fieldObject, propName, isForJsSdk } = props;
  const objectsToProcess = useContainedFieldObjects({ fieldObject });
  const nodes = React.useMemo(() => {
    const nodes: React.ReactNode[] = [];
    objectsToProcess.forEach((nextObject) => {
      nodes.push(
        renderFieldObjectAsJson(
          nextObject,
          isForJsSdk || false,
          nextObject === fieldObject ? propName : undefined
        )
      );
    });

    return nodes;
  }, [objectsToProcess, isForJsSdk, fieldObject]);

  return <React.Fragment>{nodes}</React.Fragment>;
};

export default FieldObjectAsJson;

export function renderJsonFieldType(
  data: any,
  isForJsSdk: boolean
): React.ReactNode {
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
    const containedTypeNode = renderJsonFieldType(data.type, isForJsSdk);
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
    const nodes: React.ReactNode[] = [];
    forEach(data.types, (nextType, index) => {
      if (index > 0) nodes.push(" | ");
      nodes.push(renderJsonFieldType(nextType, isForJsSdk));
    });
    return nodes;
  } else if (isFieldBinary(data)) {
    if (isForJsSdk)
      return (
        <span>
          <code>string</code> |{" "}
          <a href="https://nodejs.org/api/stream.html#class-streamreadable">
            <code>Readable</code>
          </a>{" "}
          |{" "}
          <a href="https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream">
            <code>ReadableStream</code>
          </a>
        </span>
      );
    return "binary";
  } else if (isFieldCustomType(data)) {
    if (data.descriptionLink) {
      return <a href={data.descriptionLink}>{data.name}</a>;
    } else {
      return data.name;
    }
  }

  return "unknown";
}

function renderFieldObjectAsJson(
  nextObject: FieldObject,
  isForJsSdk: boolean,
  propName?: string
) {
  const rows = map(nextObject.fields, (fieldbase, key) => {
    const keyNode = <span>{key}</span>;
    const typeNode = renderJsonFieldType(fieldbase.data, isForJsSdk);
    return (
      <div className={classes.jsonEntry}>
        {keyNode}: {typeNode}
      </div>
    );
  });

  return (
    <div className={classes.jsonRoot}>
      <Space split={htmlCharacterCodes.doubleDash}>
        {propName && <code>{propName}</code>}
        {nextObject.name && (
          <Typography.Title
            id={nextObject.name}
            level={5}
            className={classes.title}
            type="secondary"
          >
            {nextObject.name}
          </Typography.Title>
        )}
        {nextObject.required ? <code>Required</code> : <code>Optional</code>}
      </Space>
      <FieldDescription fieldbase={nextObject} />
      <div className={classes.jsonContent}>
        &#123;
        {rows}
        &#125;
      </div>
    </div>
  );
}
