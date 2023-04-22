import { map } from "lodash";
import {
  FieldArray,
  FieldBase,
  FieldBinary,
  FieldBoolean,
  FieldDate,
  FieldNull,
  FieldNumber,
  FieldObject,
  FieldOrCombination,
  FieldString,
  FieldUndefined,
  HttpEndpointDefinition,
  HttpEndpointMultipartFormdata,
} from "./types";

export function isFieldBase(data: any): data is FieldBase {
  return data && (data as FieldBase).__id === "FieldBase";
}

export function isFieldString(data: any): data is FieldString {
  return data && (data as FieldString).__id === "FieldString";
}

export function isFieldNumber(data: any): data is FieldNumber {
  return data && (data as FieldNumber).__id === "FieldNumber";
}

export function isFieldBoolean(data: any): data is FieldBoolean {
  return data && (data as FieldBoolean).__id === "FieldBoolean";
}

export function isFieldNull(data: any): data is FieldNull {
  return data && (data as FieldNull).__id === "FieldNull";
}

export function isFieldUndefined(data: any): data is FieldUndefined {
  return data && (data as FieldUndefined).__id === "FieldUndefined";
}

export function isFieldDate(data: any): data is FieldDate {
  return data && (data as FieldDate).__id === "FieldDate";
}

export function isFieldArray(data: any): data is FieldArray {
  return data && (data as FieldArray).__id === "FieldArray";
}

export function isFieldObject(data: any): data is FieldObject {
  return data && (data as FieldObject).__id === "FieldObject";
}

export function isFieldOrCombination(data: any): data is FieldOrCombination {
  return data && (data as FieldOrCombination).__id === "FieldOrCombination";
}

export function isFieldBinary(data: any): data is FieldBinary {
  return data && (data as FieldBinary).__id === "FieldBinary";
}

export function isHttpEndpointMultipartFormdata(
  data: any
): data is HttpEndpointMultipartFormdata {
  return (
    data &&
    (data as HttpEndpointMultipartFormdata).__id ===
      "HttpEndpointMultipartFormdata"
  );
}

export function isHttpEndpointDefinition(
  data: any
): data is HttpEndpointDefinition {
  return (
    data && (data as HttpEndpointDefinition).__id === "HttpEndpointDefinition"
  );
}

export function extractContainedFieldObjects(data: any): FieldObject[] {
  if (isFieldArray(data)) {
    if (data.type) {
      return extractContainedFieldObjects(data.type);
    }
  } else if (isFieldObject(data)) {
    let containedObjects = [data];

    if (data.fields) {
      containedObjects = containedObjects.concat(
        ...map(data.fields, extractContainedFieldObjects)
      );
    }

    return containedObjects;
  } else if (isFieldOrCombination(data)) {
    if (data.types) {
      const containedObjects: FieldObject[] = [];
      return containedObjects.concat(
        ...data.types.map(extractContainedFieldObjects)
      );
    }
  }

  return [];
}
