import { css, cx } from "@emotion/css";
import { Divider, Typography } from "antd";
import { map } from "lodash-es";
import prettyBytes from "pretty-bytes";
import React from "react";
import { StyleableComponentProps } from "../utils/styling/types";
import { FieldBase } from "./types";
import {
  isFieldArray,
  isFieldBinary,
  isFieldBoolean,
  isFieldCustomType,
  isFieldDate,
  isFieldNumber,
  isFieldOrCombination,
  isFieldString,
} from "./utils";

const { Text, Paragraph } = Typography;

export interface FieldDescriptionProps extends StyleableComponentProps {
  fieldbase: any;
  type?: "secondary";
}

const classes = {
  root: css({
    margin: "2px 0px",
  }),
  underline: css({
    textDecoration: "underline",
  }),
};

const FieldDescription: React.FC<FieldDescriptionProps> = (props) => {
  const { fieldbase, style, className, type } = props;
  const nodes: React.ReactNode[] = [];
  if (fieldbase && (fieldbase as Pick<FieldBase, "description">)) {
    nodes.push(
      <Paragraph key="description" type={type}>
        {fieldbase.description}
      </Paragraph>
    );
  }

  if (isFieldString(fieldbase)) {
    if (fieldbase.valid) {
      nodes.push(
        <Paragraph key="string-enum">
          <Text className={classes.underline}>Enum</Text>:{" "}
          {map(fieldbase.valid, (enumString) => (
            <Text code>{enumString}</Text>
          ))}
        </Paragraph>
      );
    }
    if (fieldbase.min) {
      nodes.push(
        <Paragraph key="string-min">
          <Text className={classes.underline}>Min characters</Text>:{" "}
          {fieldbase.min}
        </Paragraph>
      );
    }
    if (fieldbase.max) {
      nodes.push(
        <Paragraph key="string-max">
          <Text className={classes.underline}>Max characters</Text>:{" "}
          {fieldbase.max}
        </Paragraph>
      );
    }
    if (fieldbase.example) {
      nodes.push(
        <Paragraph key="string-example">
          <Text className={classes.underline}>Example</Text>:{" "}
          {fieldbase.example}
        </Paragraph>
      );
    }
  } else if (isFieldNumber(fieldbase)) {
    if (fieldbase.integer) {
      nodes.push(
        <Paragraph key="number-subset">
          <Text className={classes.underline}>Number subset</Text>:{" "}
          <Text code>integer</Text> only
        </Paragraph>
      );
    } else {
      nodes.push(
        <Paragraph key="number-subset">
          <Text className={classes.underline}>Number subset</Text>:{" "}
          <Text code>floating point</Text> or <Text code>integer</Text>
        </Paragraph>
      );
    }

    if (fieldbase.min) {
      nodes.push(
        <Paragraph key="number-min">
          <Text className={classes.underline}>Min</Text>: {fieldbase.min}
        </Paragraph>
      );
    }
    if (fieldbase.max) {
      nodes.push(
        <Paragraph key="number-max">
          <Text className={classes.underline}>Max</Text>: {fieldbase.max}
        </Paragraph>
      );
    }
    if (fieldbase.example) {
      nodes.push(
        <Paragraph key="number-example">
          <Text className={classes.underline}>Example</Text>:{" "}
          {fieldbase.example}
        </Paragraph>
      );
    }
  } else if (isFieldBoolean(fieldbase)) {
    if (fieldbase.example) {
      nodes.push(
        <Paragraph key="boolean-example">
          <Text className={classes.underline}>Example</Text>:{" "}
          {fieldbase.example}
        </Paragraph>
      );
    }
  } else if (isFieldDate(fieldbase)) {
    nodes.push(
      <Paragraph key="date-fieldbase-type">
        <Text code>unix milliseconds timestamp</Text>
      </Paragraph>
    );

    if (fieldbase.example) {
      nodes.push(
        <Paragraph key="date-example">
          <Text className={classes.underline}>Example</Text>:{" "}
          {fieldbase.example}
        </Paragraph>
      );
    }
  } else if (isFieldArray(fieldbase)) {
    if (fieldbase.min) {
      nodes.push(
        <Paragraph key="array-min">
          <Text className={classes.underline}>Min items</Text>: {fieldbase.min}
        </Paragraph>
      );
    }
    if (fieldbase.max) {
      nodes.push(
        <Paragraph key="array-max">
          <Text className={classes.underline}>Max items</Text>: {fieldbase.max}
        </Paragraph>
      );
    }
  } else if (isFieldBinary(fieldbase)) {
    if (fieldbase.min) {
      nodes.push(
        <Paragraph key="binary-min">
          <Text className={classes.underline}>Min bytes</Text>:{" "}
          {prettyBytes(fieldbase.min)}
        </Paragraph>
      );
    }
    if (fieldbase.max) {
      nodes.push(
        <Paragraph key="binary-max">
          <Text className={classes.underline}>Max bytes</Text>:{" "}
          {prettyBytes(fieldbase.max)}
        </Paragraph>
      );
    }
  } else if (isFieldCustomType(fieldbase)) {
    if (fieldbase.descriptionLink) {
      nodes.push(
        <Paragraph key="custom-type-description-link">
          <Text className={classes.underline}>Link</Text>:{" "}
          <a href={fieldbase.descriptionLink}>{fieldbase.descriptionLink}</a>
        </Paragraph>
      );
    }
  } else if (isFieldOrCombination(fieldbase)) {
    const descriptions = map(fieldbase.types ?? {}, (type, i) => (
      <React.Fragment key={i}>
        {Number(i) != 0 && <Divider>OR</Divider>}
        <FieldDescription fieldbase={type} />
      </React.Fragment>
    ));
    nodes.push(...descriptions);
  }

  return (
    <div style={style} className={cx(classes.root, className)}>
      {nodes}
    </div>
  );
};

export default FieldDescription;
