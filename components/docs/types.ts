import { RenderableTreeNode, Tag } from "@markdoc/markdoc";

export type TableOfContentSection = Tag["attributes"] & {
  title: RenderableTreeNode;
};

export enum HttpEndpointMethod {
  Get = "get",
  Post = "post",
  Delete = "delete",
}

export type FieldBase = {
  __id: "FieldBase";
  stringType: "any";
  required?: boolean;
  description?: string;
};

export type FieldString = {
  __id: "FieldString";
  stringType: "string";
  required?: boolean;
  description?: string;
  example?: string;
  valid?: string[];
  min?: number;
  max?: number;
  enumName?: string;
};

export type FieldNumber = {
  __id: "FieldNumber";
  stringType: "number";
  required?: boolean;
  description?: string;
  example?: number;
  integer?: boolean;
  min?: number;
  max?: number;
};

export type FieldBoolean = {
  __id: "FieldBoolean";
  stringType: "boolean";
  required?: boolean;
  description?: string;
  example?: boolean;
};

export type FieldNull = {
  __id: "FieldNull";
  stringType: "null";
};

export type FieldUndefined = {
  __id: "FieldUndefined";
  stringType: "undefined";
};

export type FieldDate = {
  __id: "FieldDate";
  stringType: "number";
  required?: boolean;
  description?: string;
  example?: string;
};

export type FieldArray = {
  __id: "FieldArray";
  required?: boolean;
  description?: string;
  type?: FieldBase;
  min?: number;
  max?: number;
};

export type FieldObject = {
  __id: "FieldObject";
  stringType: "object";
  required?: boolean;
  description?: string;
  name?: string | undefined;
  fields?: Record<
    string,
    { data: FieldBase; required: boolean; optional: boolean }
  >;
};

export type FieldOrCombination = {
  __id: "FieldOrCombination";
  required?: boolean;
  description?: string;
  types?: Array<FieldBase>;
};

export type FieldBinary = {
  __id: "FieldBinary";
  stringType: "binary";
  min?: number;
  max?: number;
};

export type HttpEndpointMultipartFormdata = {
  __id: "HttpEndpointMultipartFormdata";
  items?: FieldObject;
};

export type HttpEndpointDefinition = {
  __id: "HttpEndpointDefinition";
  basePathname?: string;
  method?: HttpEndpointMethod;
  pathParamaters?: FieldObject;
  query?: FieldObject;
  requestHeaders?: FieldObject;
  requestBody?: FieldObject | HttpEndpointMultipartFormdata;
  responseHeaders?: FieldObject;
  responseBody?: FieldBinary | FieldObject;
  name?: string;
  description?: string;
  errorResponseHeaders?: FieldObject;
  errorResponseBody?: FieldObject;
};

export type RestApiDocsTableOfContentType = Array<string | [string, string[]]>;
export interface IRawNavItem {
  key: string;
  label: React.ReactNode;
  withLink?: boolean;
  children?: IRawNavItem[];
}
