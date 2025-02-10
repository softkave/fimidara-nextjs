import { css } from "@emotion/css";
import { forEach, map } from "lodash-es";
import React from "react";
import { cn } from "../utils.ts";
import { htmlCharacterCodes } from "../utils/utils";
import FieldDescription from "./FieldDescription";
import { useContainedFieldObjects } from "./hooks";
import { FieldObject } from "./types";
import {
  getTypeNameID,
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
  jsonRoot: css({
    margin: "24px 0px",
  }),
  jsonEntry: css({
    margin: "0px 16px",
  }),
  jsonContent: css({
    padding: "16px",
    borderRadius: "4px",
    fontFamily: `var(--font-code), monospace !important`,

    "& *": {
      fontFamily: `var(--font-code), monospace !important`,
    },
  }),
};

const FieldObjectAsJson: React.FC<FieldObjectAsJsonProps> = (props) => {
  const { fieldObject, propName, isForJsSdk } = props;
  const objectsToProcess = useContainedFieldObjects({ fieldObject });
  const nodes = React.useMemo(() => {
    const nodes: React.ReactNode[] = [];
    let counter = 0;
    objectsToProcess.forEach((nextObject, index) => {
      nodes.push(
        renderFieldObjectAsJson(
          nextObject,
          isForJsSdk || false,
          nextObject === fieldObject ? propName : undefined,
          nextObject.name || counter++
        )
      );
    });

    return nodes;
  }, [objectsToProcess, isForJsSdk, fieldObject, propName]);

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
    return data.name ? (
      <a href={`#${getTypeNameID(data.name)}`} className="underline">
        {data.name}
      </a>
    ) : null;
  } else if (isFieldOrCombination(data)) {
    if (!data.types) return "";
    const nodes: React.ReactNode[] = [];
    forEach(data.types, (nextType, index) => {
      if (Number(index) > 0) nodes.push(" | ");
      nodes.push(renderJsonFieldType(nextType, isForJsSdk));
    });
    return nodes;
  } else if (isFieldBinary(data)) {
    if (isForJsSdk)
      return (
        <span>
          {isForJsSdk ? <span>string</span> : <code>string</code>}|{" "}
          <a
            href="https://nodejs.org/api/stream.html#class-streamreadable"
            className="underline"
          >
            {isForJsSdk ? <span>Readable</span> : <code>Readable</code>}|{" "}
          </a>{" "}
          |{" "}
          <a
            href="https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream"
            className="underline"
          >
            {isForJsSdk ? (
              <span>ReadableStream</span>
            ) : (
              <code>ReadableStream</code>
            )}
          </a>
        </span>
      );
    return "binary";
  } else if (isFieldCustomType(data)) {
    if (data.descriptionLink) {
      return (
        <a href={data.descriptionLink} className="underline">
          {data.name}
        </a>
      );
    } else {
      return data.name;
    }
  }

  return "unknown";
}

function renderFieldObjectAsJson(
  nextObject: FieldObject,
  isForJsSdk: boolean,
  propName: string | undefined,
  key: string | number
) {
  const rows = map(nextObject.fields, (fieldbase, key) => {
    const keyNode = <span>{key}</span>;
    const typeNode = renderJsonFieldType(fieldbase.data, isForJsSdk);
    const separator = fieldbase.required ? ":" : "?:";
    return (
      <div className={classes.jsonEntry} key={key}>
        {keyNode}
        {separator} {typeNode}
      </div>
    );
  });

  return (
    <div className={classes.jsonRoot} key={key}>
      <div className="space-x-2 flex">
        {propName && <code>{propName}</code>}
        {nextObject.name && (
          <h5 id={getTypeNameID(nextObject.name)}>{nextObject.name}</h5>
        )}
        {nextObject.required ? (
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
      <FieldDescription fieldbase={nextObject} type="secondary" />
      <div className={cn(classes.jsonContent, "bg-gray-100 w-full mt-4")}>
        &#123;
        {rows}
        &#125;
      </div>
    </div>
  );
}
