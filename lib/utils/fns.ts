import { compact, flatten } from "lodash-es";
import moment from "moment";

export function cast<ToType>(resource: any): ToType {
  return resource as unknown as ToType;
}

const timeRegex =
  /^(?<hour>\d{1,2}):(?<minute>\d{1,2})[\s]?(?<meridian>am|pm)$/i;

// expects time to be in '9:00 am' format
export function getMomentFromTime(time: string) {
  const match = time.match(timeRegex);

  if (!match) {
    return null;
  }

  const hour = match.groups?.hour;
  const minute = match.groups?.minute;
  const meridian = match.groups?.meridian;

  if (!hour || !minute || !meridian) {
    return null;
  }

  if (meridian.toLowerCase() === "am") {
    return moment().hours(Number(hour)).minutes(Number(minute));
  } else {
    return moment()
      .hours(Number(hour) + 12)
      .minutes(Number(minute));
  }
}

export function toBoolean(...args: any[]) {
  return !!args.find((arg) => !!arg);
}

export function makeKey(fields: any[], separator = "-", omitFalsy = true) {
  if (omitFalsy) {
    fields = compact(fields);
  }

  return fields.join(separator);
}

export function toArray<T>(...args: Array<T | T[]>) {
  const arrays = args.map((item) => {
    if (Array.isArray(item)) {
      return item;
    } else {
      return [item];
    }
  });
  return flatten(arrays);
}

export function toNonNullableArray<T>(...args: Array<NonNullable<T | T[]>>) {
  return toArray(...args);
}

export function toCompactArray<T>(...args: Array<T | T[]>) {
  const array = toArray(...args);
  return compact(array as Array<NonNullable<T> | undefined>);
}

export function defaultArrayTo<T>(array: T[], data: NonNullable<T | T[]>) {
  return array.length ? array : toCompactArray(data);
}

export function calculatePageSize(
  count: number,
  pageSize: number,
  /** zero-index based page */ page: number
) {
  count = Math.max(count, 0);
  pageSize = Math.max(pageSize, 0);
  page = Math.max(page, 0);
  if (count === 0 ?? pageSize === 0) return 0;
  const maxFullPages = Math.floor(count / pageSize);
  const pageCount =
    page < maxFullPages ? pageSize : count - maxFullPages * pageSize;
  return pageCount;
}

export function isObjectEmpty(data: Record<string | number, any>) {
  return Object.keys(data).length === 0;
}
