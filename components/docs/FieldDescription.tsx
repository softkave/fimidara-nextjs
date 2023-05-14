import { css, cx } from "@emotion/css";
import { Typography } from "antd";
import { map } from "lodash";
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
  isFieldString,
} from "./utils";

export interface FieldDescriptionProps extends StyleableComponentProps {
  fieldbase: any;
}

const classes = {
  root: css({
    margin: "2px 0px",
  }),
};

const FieldDescription: React.FC<FieldDescriptionProps> = (props) => {
  const { fieldbase, style, className } = props;
  const nodes: React.ReactNode[] = [];
  if (fieldbase && (fieldbase as Pick<FieldBase, "description">)) {
    nodes.push(
      <Typography.Paragraph key="description">
        {fieldbase.description}
      </Typography.Paragraph>
    );
  }

  if (isFieldString(fieldbase)) {
    if (fieldbase.valid) {
      nodes.push(
        <Typography.Paragraph key="string-enum">
          <b>Enum: </b>
          {map(fieldbase.valid, (enumString) => (
            <Typography.Text code>{enumString}</Typography.Text>
          ))}
        </Typography.Paragraph>
      );
    }
    if (fieldbase.min) {
      nodes.push(
        <Typography.Paragraph key="string-min">
          <b>Min characters: </b>
          {fieldbase.min}
        </Typography.Paragraph>
      );
    }
    if (fieldbase.max) {
      nodes.push(
        <Typography.Paragraph key="string-max">
          <b>Max characters: </b>
          {fieldbase.max}
        </Typography.Paragraph>
      );
    }
    if (fieldbase.example) {
      nodes.push(
        <Typography.Paragraph key="string-example">
          <b>Example: </b>
          {fieldbase.example}
        </Typography.Paragraph>
      );
    }
  } else if (isFieldNumber(fieldbase)) {
    if (fieldbase.integer) {
      nodes.push(
        <Typography.Paragraph key="number-subset">
          <b>Number subset: </b>
          <Typography.Text code>integer</Typography.Text> only
        </Typography.Paragraph>
      );
    } else {
      nodes.push(
        <Typography.Paragraph key="number-subset">
          <b>Number subset: </b>
          <Typography.Text code>floating point</Typography.Text> or{" "}
          <Typography.Text code>integer</Typography.Text>
        </Typography.Paragraph>
      );
    }

    if (fieldbase.min) {
      nodes.push(
        <Typography.Paragraph key="number-min">
          <b>Min: </b>
          {fieldbase.min}
        </Typography.Paragraph>
      );
    }
    if (fieldbase.max) {
      nodes.push(
        <Typography.Paragraph key="number-max">
          <b>Max: </b>
          {fieldbase.max}
        </Typography.Paragraph>
      );
    }
    if (fieldbase.example) {
      nodes.push(
        <Typography.Paragraph key="number-example">
          <b>Example: </b>
          {fieldbase.example}
        </Typography.Paragraph>
      );
    }
  } else if (isFieldBoolean(fieldbase)) {
    if (fieldbase.example) {
      nodes.push(
        <Typography.Paragraph key="boolean-example">
          <b>Example: </b>
          {fieldbase.example}
        </Typography.Paragraph>
      );
    }
  } else if (isFieldDate(fieldbase)) {
    nodes.push(
      <Typography.Paragraph key="date-fieldbase-type">
        <Typography.Text code>unix milliseconds timestamp</Typography.Text>
      </Typography.Paragraph>
    );

    if (fieldbase.example) {
      nodes.push(
        <Typography.Paragraph key="date-example">
          <b>Example: </b>
          {fieldbase.example}
        </Typography.Paragraph>
      );
    }
  } else if (isFieldArray(fieldbase)) {
    if (fieldbase.min) {
      nodes.push(
        <Typography.Paragraph key="array-min">
          <b>Min items: </b>
          {fieldbase.min}
        </Typography.Paragraph>
      );
    }
    if (fieldbase.max) {
      nodes.push(
        <Typography.Paragraph key="array-max">
          <b>Max items: </b>
          {fieldbase.max}
        </Typography.Paragraph>
      );
    }
  } else if (isFieldBinary(fieldbase)) {
    if (fieldbase.min) {
      nodes.push(
        <Typography.Paragraph key="binary-min">
          <b>Min bytes: </b>
          {prettyBytes(fieldbase.min)}
        </Typography.Paragraph>
      );
    }
    if (fieldbase.max) {
      nodes.push(
        <Typography.Paragraph key="binary-max">
          <b>Max bytes: </b>
          {prettyBytes(fieldbase.max)}
        </Typography.Paragraph>
      );
    }
  } else if (isFieldCustomType(fieldbase)) {
    if (fieldbase.descriptionLink) {
      nodes.push(
        <Typography.Paragraph key="custom-type-description-link">
          <b>Link: </b>
          <a href={fieldbase.descriptionLink}>{fieldbase.descriptionLink}</a>
        </Typography.Paragraph>
      );
    }
  }

  return (
    <div style={style} className={cx(classes.root, className)}>
      {nodes}
    </div>
  );
};

export default FieldDescription;
