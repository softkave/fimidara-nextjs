import { css } from "@emotion/css";
import { Typography } from "antd";
import { map } from "lodash";
import prettyBytes from "pretty-bytes";
import React from "react";
import { FieldBase } from "./types";
import {
  isFieldArray,
  isFieldBinary,
  isFieldBoolean,
  isFieldDate,
  isFieldNumber,
  isFieldString,
} from "./utils";

export interface FieldDescriptionProps {
  fieldbase: any;
}

const classes = {
  p: css({ margin: "2px 0px !important" }),
};

const FieldDescription: React.FC<FieldDescriptionProps> = (props) => {
  const { fieldbase } = props;
  const nodes: React.ReactNode[] = [];
  if (fieldbase && (fieldbase as Pick<FieldBase, "description">)) {
    nodes.push(
      <Typography.Paragraph className={classes.p} key="description">
        {fieldbase.description}
      </Typography.Paragraph>
    );
  }

  if (isFieldString(fieldbase)) {
    if (fieldbase.valid) {
      nodes.push(
        <Typography.Paragraph className={classes.p} key="string-enum">
          <b>Enum: </b>
          {map(fieldbase.valid, (enumString) => (
            <code>{enumString}</code>
          ))}
        </Typography.Paragraph>
      );
    }
    if (fieldbase.min) {
      nodes.push(
        <Typography.Paragraph className={classes.p} key="string-min">
          <b>Min characters: </b>
          {fieldbase.min}
        </Typography.Paragraph>
      );
    }
    if (fieldbase.max) {
      nodes.push(
        <Typography.Paragraph className={classes.p} key="string-max">
          <b>Max characters: </b>
          {fieldbase.max}
        </Typography.Paragraph>
      );
    }
    if (fieldbase.example) {
      nodes.push(
        <Typography.Paragraph className={classes.p} key="string-example">
          <b>Example: </b>
          {fieldbase.example}
        </Typography.Paragraph>
      );
    }
  } else if (isFieldNumber(fieldbase)) {
    if (fieldbase.integer) {
      nodes.push(
        <Typography.Paragraph className={classes.p} key="number-subset">
          <b>Number subset: </b>
          <code>integer</code> only
        </Typography.Paragraph>
      );
    } else {
      nodes.push(
        <Typography.Paragraph className={classes.p} key="number-subset">
          <b>Number subset: </b>
          <code>floating point</code> or <code>integer</code>
        </Typography.Paragraph>
      );
    }

    if (fieldbase.min) {
      nodes.push(
        <Typography.Paragraph className={classes.p} key="number-min">
          <b>Min: </b>
          {fieldbase.min}
        </Typography.Paragraph>
      );
    }
    if (fieldbase.max) {
      nodes.push(
        <Typography.Paragraph className={classes.p} key="number-max">
          <b>Max: </b>
          {fieldbase.max}
        </Typography.Paragraph>
      );
    }
    if (fieldbase.example) {
      nodes.push(
        <Typography.Paragraph className={classes.p} key="number-example">
          <b>Example: </b>
          {fieldbase.example}
        </Typography.Paragraph>
      );
    }
  } else if (isFieldBoolean(fieldbase)) {
    if (fieldbase.example) {
      nodes.push(
        <Typography.Paragraph className={classes.p} key="boolean-example">
          <b>Example: </b>
          {fieldbase.example}
        </Typography.Paragraph>
      );
    }
  } else if (isFieldDate(fieldbase)) {
    nodes.push(
      <Typography.Paragraph className={classes.p} key="date-fieldbase-type">
        <code>unix milliseconds timestamp</code>
      </Typography.Paragraph>
    );

    if (fieldbase.example) {
      nodes.push(
        <Typography.Paragraph className={classes.p} key="date-example">
          <b>Example: </b>
          {fieldbase.example}
        </Typography.Paragraph>
      );
    }
  } else if (isFieldArray(fieldbase)) {
    if (fieldbase.min) {
      nodes.push(
        <Typography.Paragraph className={classes.p} key="array-min">
          <b>Min items: </b>
          {fieldbase.min}
        </Typography.Paragraph>
      );
    }
    if (fieldbase.max) {
      nodes.push(
        <Typography.Paragraph className={classes.p} key="array-max">
          <b>Max items: </b>
          {fieldbase.max}
        </Typography.Paragraph>
      );
    }
  } else if (isFieldBinary(fieldbase)) {
    if (fieldbase.min) {
      nodes.push(
        <Typography.Paragraph className={classes.p} key="binary-min">
          <b>Min bytes: </b>
          {prettyBytes(fieldbase.min)}
        </Typography.Paragraph>
      );
    }
    if (fieldbase.max) {
      nodes.push(
        <Typography.Paragraph className={classes.p} key="binary-max">
          <b>Max bytes: </b>
          {prettyBytes(fieldbase.max)}
        </Typography.Paragraph>
      );
    }
  }

  return <React.Fragment>{nodes}</React.Fragment>;
};

export default FieldDescription;
