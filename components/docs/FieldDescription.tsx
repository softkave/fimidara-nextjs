import { css, cx } from "@emotion/css";
import { Divider, Typography } from "antd";
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
  isFieldOrCombination,
  isFieldString,
} from "./utils";

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
      <Typography.Paragraph key="description" type={type}>
        {fieldbase.description}
      </Typography.Paragraph>
    );
  }

  if (isFieldString(fieldbase)) {
    if (fieldbase.valid) {
      nodes.push(
        <Typography.Paragraph key="string-enum">
          <Typography.Text className={classes.underline}>Enum</Typography.Text>:{" "}
          {map(fieldbase.valid, (enumString) => (
            <Typography.Text code>{enumString}</Typography.Text>
          ))}
        </Typography.Paragraph>
      );
    }
    if (fieldbase.min) {
      nodes.push(
        <Typography.Paragraph key="string-min">
          <Typography.Text className={classes.underline}>
            Min characters
          </Typography.Text>
          : {fieldbase.min}
        </Typography.Paragraph>
      );
    }
    if (fieldbase.max) {
      nodes.push(
        <Typography.Paragraph key="string-max">
          <Typography.Text className={classes.underline}>
            Max characters
          </Typography.Text>
          : {fieldbase.max}
        </Typography.Paragraph>
      );
    }
    if (fieldbase.example) {
      nodes.push(
        <Typography.Paragraph key="string-example">
          <Typography.Text className={classes.underline}>
            Example
          </Typography.Text>
          : {fieldbase.example}
        </Typography.Paragraph>
      );
    }
  } else if (isFieldNumber(fieldbase)) {
    if (fieldbase.integer) {
      nodes.push(
        <Typography.Paragraph key="number-subset">
          <Typography.Text className={classes.underline}>
            Number subset
          </Typography.Text>
          : <Typography.Text code>integer</Typography.Text> only
        </Typography.Paragraph>
      );
    } else {
      nodes.push(
        <Typography.Paragraph key="number-subset">
          <Typography.Text className={classes.underline}>
            Number subset
          </Typography.Text>
          : <Typography.Text code>floating point</Typography.Text> or{" "}
          <Typography.Text code>integer</Typography.Text>
        </Typography.Paragraph>
      );
    }

    if (fieldbase.min) {
      nodes.push(
        <Typography.Paragraph key="number-min">
          <Typography.Text className={classes.underline}>Min</Typography.Text>:{" "}
          {fieldbase.min}
        </Typography.Paragraph>
      );
    }
    if (fieldbase.max) {
      nodes.push(
        <Typography.Paragraph key="number-max">
          <Typography.Text className={classes.underline}>Max</Typography.Text>:{" "}
          {fieldbase.max}
        </Typography.Paragraph>
      );
    }
    if (fieldbase.example) {
      nodes.push(
        <Typography.Paragraph key="number-example">
          <Typography.Text className={classes.underline}>
            Example
          </Typography.Text>
          : {fieldbase.example}
        </Typography.Paragraph>
      );
    }
  } else if (isFieldBoolean(fieldbase)) {
    if (fieldbase.example) {
      nodes.push(
        <Typography.Paragraph key="boolean-example">
          <Typography.Text className={classes.underline}>
            Example
          </Typography.Text>
          : {fieldbase.example}
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
          <Typography.Text className={classes.underline}>
            Example
          </Typography.Text>
          : {fieldbase.example}
        </Typography.Paragraph>
      );
    }
  } else if (isFieldArray(fieldbase)) {
    if (fieldbase.min) {
      nodes.push(
        <Typography.Paragraph key="array-min">
          <Typography.Text className={classes.underline}>
            Min items
          </Typography.Text>
          : {fieldbase.min}
        </Typography.Paragraph>
      );
    }
    if (fieldbase.max) {
      nodes.push(
        <Typography.Paragraph key="array-max">
          <Typography.Text className={classes.underline}>
            Max items
          </Typography.Text>
          : {fieldbase.max}
        </Typography.Paragraph>
      );
    }
  } else if (isFieldBinary(fieldbase)) {
    if (fieldbase.min) {
      nodes.push(
        <Typography.Paragraph key="binary-min">
          <Typography.Text className={classes.underline}>
            Min bytes
          </Typography.Text>
          : {prettyBytes(fieldbase.min)}
        </Typography.Paragraph>
      );
    }
    if (fieldbase.max) {
      nodes.push(
        <Typography.Paragraph key="binary-max">
          <Typography.Text className={classes.underline}>
            Max bytes
          </Typography.Text>
          : {prettyBytes(fieldbase.max)}
        </Typography.Paragraph>
      );
    }
  } else if (isFieldCustomType(fieldbase)) {
    if (fieldbase.descriptionLink) {
      nodes.push(
        <Typography.Paragraph key="custom-type-description-link">
          <Typography.Text className={classes.underline}>Link</Typography.Text>:{" "}
          <a href={fieldbase.descriptionLink}>{fieldbase.descriptionLink}</a>
        </Typography.Paragraph>
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
