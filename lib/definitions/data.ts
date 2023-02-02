import { AnyObject } from "../utils/types";
import { AppResourceType } from "./system";

export interface IResourceWithId {
  customId: string;
}

export type DataProviderLiteralType =
  | string
  | number
  | boolean
  | null
  | undefined
  | Date;

// TODO: reclassify ops based on Mongo ops, but split comparison into number and other literals
export interface IComparisonLiteralFieldQueryOps<
  T extends DataProviderLiteralType = DataProviderLiteralType
> {
  $eq?: T;
  $in?: T[];
  $ne?: T;
  $nin?: T[];
  $exists?: boolean;
  $regex?: RegExp;
}

export interface INumberLiteralFieldQueryOps {
  $gt?: number;
  $gte?: number;
  $lt?: number;
  $lte?: number;
}

export type ILiteralFieldQueryOps<T = DataProviderLiteralType> =
  T extends DataProviderLiteralType
    ? (IComparisonLiteralFieldQueryOps<T> & INumberLiteralFieldQueryOps) | T
    : never;

type LiteralDataQuery<T> = {
  [P in keyof T]?: ILiteralFieldQueryOps<T[P]>;
};

export interface IRecordFieldQueryOps<T extends AnyObject> {
  $objMatch: LiteralDataQuery<T>;
}

type ElemMatchQueryOp<T> = T extends AnyObject
  ? LiteralDataQuery<T>
  : ILiteralFieldQueryOps<T>;

export interface IArrayFieldQueryOps<T> {
  $size?: number;
  $all?: T extends DataProviderLiteralType
    ? Array<ILiteralFieldQueryOps<T>>
    : never;
  $elemMatch?: ElemMatchQueryOp<T>;
}

export type FieldQueryOps = Exclude<
  ILiteralFieldQueryOps & IArrayFieldQueryOps<any> & IRecordFieldQueryOps<any>,
  DataProviderLiteralType
>;

export type DataQuery<T extends AnyObject> = {
  [P in keyof T]?: T[P] extends DataProviderLiteralType | Date
    ? ILiteralFieldQueryOps<T[P]>
    : NonNullable<T[P]> extends Array<infer U>
    ? IArrayFieldQueryOps<U>
    : NonNullable<T[P]> extends AnyObject
    ? IRecordFieldQueryOps<NonNullable<T[P]>>
    : void;
};

export interface IResourceContainer<T extends IResourceWithId> {
  type: AppResourceType;
  data: T;
}
