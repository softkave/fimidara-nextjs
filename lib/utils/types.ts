export interface IUpdateItemById<T> {
  id: string;
  data: Partial<T>;
}

export type ConvertTypeOneToTypeTwo<T extends object, One, Two> = {
  [Key in keyof T]: T[Key] extends One
    ? Two
    : T[Key] extends any[]
    ? T[Key][0] extends One
      ? Two
      : T[Key][0] extends object
      ? ConvertTypeOneToTypeTwo<T[Key][0], One, Two>
      : T[Key][0]
    : T[Key] extends object
    ? ConvertTypeOneToTypeTwo<T[Key], One, Two>
    : T[Key];
};

export type ConvertDatesToStrings<T extends object> = ConvertTypeOneToTypeTwo<
  T,
  Date,
  string
>;

export type AnyFn<Args extends any[] = any[], Result = any> = (
  ...args: Args
) => Result;
export type AnyObject = { [k: string | number | symbol]: any };
export type Omit1<T, K extends keyof T> = Omit<T, K>;
