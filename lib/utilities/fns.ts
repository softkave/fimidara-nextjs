import moment from "moment";

export function cast<ToType>(resource: any): ToType {
  return resource as unknown as ToType;
}

const nationalPhoneRegex = /(?<phone>\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$)/;

export function formatPhoneNumber(phone: string) {
  const result = phone.match(nationalPhoneRegex);

  if (!result) {
    return null;
  }

  let nationalPhoneNumber = result.groups?.phone;

  if (!nationalPhoneNumber) {
    return null;
  }

  nationalPhoneNumber = nationalPhoneNumber.replaceAll(/[\s.-]/g, "");
  return `+1${nationalPhoneNumber}`;
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
