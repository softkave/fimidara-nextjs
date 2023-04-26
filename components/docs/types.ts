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
  required?: boolean;
  description?: string;
};

export type FieldString = {
  __id: "FieldString";
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
  required?: boolean;
  description?: string;
  example?: number;
  integer?: boolean;
  min?: number;
  max?: number;
};

export type FieldBoolean = {
  __id: "FieldBoolean";
  required?: boolean;
  description?: string;
  example?: boolean;
};

export type FieldNull = {
  __id: "FieldNull";
  description?: string;
};

export type FieldUndefined = {
  __id: "FieldUndefined";
  description?: string;
};

export type FieldDate = {
  __id: "FieldDate";
  required?: boolean;
  description?: string;
  example?: string;
};

export type FieldArray = {
  __id: "FieldArray";
  required?: boolean;
  description?: string;
  type?: FieldType;
  min?: number;
  max?: number;
};

export type FieldObject = {
  __id: "FieldObject";
  required?: boolean;
  description?: string;
  name?: string | undefined;
  fields?: Record<
    string,
    {
      data: FieldType;
      required?: boolean;
      optional?: boolean;
    }
  >;
};

export type FieldCustomType = {
  __id: "FieldCustomType";
  required?: boolean;
  description?: string;
  descriptionLink?: string;
  name: string;
};

export type FieldOrCombination = {
  __id: "FieldOrCombination";
  required?: boolean;
  description?: string;
  types?: Array<FieldType>;
};

export type FieldBinary = {
  __id: "FieldBinary";
  description?: string;
  min?: number;
  max?: number;
};

export type FieldType =
  | FieldBase
  | FieldNumber
  | FieldString
  | FieldArray
  | FieldOrCombination
  | FieldNull
  | FieldUndefined
  | FieldCustomType
  | FieldBinary
  | FieldObject;

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
