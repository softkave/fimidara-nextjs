import { css, cx } from "@emotion/css";
import { Space } from "antd";
import Text from "antd/es/typography/Text";
import Title from "antd/es/typography/Title";
import { forEach, map } from "lodash-es";
import React from "react";
import { appClasses } from "../utils/theme";
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
    backgroundColor: "#f0f0f0",
    borderRadius: "4px",
    fontFamily: `var(--font-code), monospace !important`,

    "& *": {
      fontSize: "13px !important",
      fontFamily: `var(--font-code), monospace !important`,
      fontWeight: "500 !important",
    },
  }),
  title: css({ fontSize: "14px !important" }),
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
      <a href={`#${getTypeNameID(data.name)}`}>{data.name}</a>
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
          <Text code={!isForJsSdk}>string</Text> |{" "}
          <a href="https://nodejs.org/api/stream.html#class-streamreadable">
            <Text code={!isForJsSdk} style={{ color: "inherit" }}>
              Readable
            </Text>
          </a>{" "}
          |{" "}
          <a href="https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream">
            <Text code={!isForJsSdk} style={{ color: "inherit" }}>
              ReadableStream
            </Text>
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
      <Space split={htmlCharacterCodes.doubleDash}>
        {propName && <Text code>{propName}</Text>}
        {nextObject.name && (
          <Title
            id={getTypeNameID(nextObject.name)}
            level={5}
            className={cx(classes.title, appClasses.muteMargin)}
          >
            {nextObject.name}
          </Title>
        )}
        {nextObject.required ? (
          <Text code>Required</Text>
        ) : (
          <Text code>Optional</Text>
        )}
      </Space>
      <FieldDescription fieldbase={nextObject} type="secondary" />
      <div className={classes.jsonContent}>
        &#123;
        {rows}
        &#125;
      </div>
    </div>
  );
}
