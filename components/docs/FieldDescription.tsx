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

const FieldDescription: React.FC<FieldDescriptionProps> = (props) => {
  const { fieldbase } = props;
  const nodes: React.ReactNode[] = [];
  if (fieldbase && (fieldbase as Pick<FieldBase, "description">)) {
    nodes.push(
      <p key="description">
        <b>Description: </b>
        {fieldbase.description}
      </p>
    );
  }

  if (isFieldString(fieldbase)) {
    if (fieldbase.valid) {
      nodes.push(
        <p key="string-enum">
          <b>Enum: </b>
          {fieldbase.valid.map((enumString) => (
            <code>{enumString}</code>
          ))}
        </p>
      );
    }
    if (fieldbase.min) {
      nodes.push(
        <p key="string-min">
          <b>Min characters: </b>${fieldbase.min}
        </p>
      );
    }
    if (fieldbase.max) {
      nodes.push(
        <p key="string-max">
          <b>Max characters: </b>${fieldbase.max}
        </p>
      );
    }
    if (fieldbase.example) {
      nodes.push(
        <p key="string-example">
          <b>Example: </b>${fieldbase.example}
        </p>
      );
    }
  } else if (isFieldNumber(fieldbase)) {
    if (fieldbase.integer) {
      nodes.push(
        <p key="number-subset">
          <b>Number subset: </b>
          <code>integer</code> only
        </p>
      );
    } else {
      nodes.push(
        <p key="number-subset">
          <b>Number subset: </b>
          <code>floating point</code> or <code>integer</code> allowed
        </p>
      );
    }

    if (fieldbase.min) {
      nodes.push(
        <p key="number-min">
          <b>Min: </b>${fieldbase.min}
        </p>
      );
    }
    if (fieldbase.max) {
      nodes.push(
        <p key="number-max">
          <b>Max: </b>${fieldbase.max}
        </p>
      );
    }
    if (fieldbase.example) {
      nodes.push(
        <p key="number-example">
          <b>Example: </b>${fieldbase.example}
        </p>
      );
    }
  } else if (isFieldBoolean(fieldbase)) {
    if (fieldbase.example) {
      nodes.push(
        <p key="boolean-example">
          <b>Example: </b>${fieldbase.example}
        </p>
      );
    }
  } else if (isFieldDate(fieldbase)) {
    nodes.push(
      <p key="date-fieldbase-type">
        <code>unix milliseconds timestamp</code>
      </p>
    );

    if (fieldbase.example) {
      nodes.push(
        <p key="date-example">
          <b>Example: </b>${fieldbase.example}
        </p>
      );
    }
  } else if (isFieldArray(fieldbase)) {
    if (fieldbase.min) {
      nodes.push(
        <p key="array-min">
          <b>Min items: </b>${fieldbase.min}
        </p>
      );
    }
    if (fieldbase.max) {
      nodes.push(
        <p key="array-max">
          <b>Max items: </b>${fieldbase.max}
        </p>
      );
    }
  } else if (isFieldBinary(fieldbase)) {
    if (fieldbase.min) {
      nodes.push(
        <p key="binary-min">
          <b>Min bytes: </b>${fieldbase.min}
        </p>
      );
    }
    if (fieldbase.max) {
      nodes.push(
        <p key="binary-max">
          <b>Max bytes: </b>${fieldbase.max}
        </p>
      );
    }
  }

  return <React.Fragment>{nodes}</React.Fragment>;
};

export default FieldDescription;
