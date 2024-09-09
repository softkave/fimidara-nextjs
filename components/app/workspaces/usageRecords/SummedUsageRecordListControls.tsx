import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select.tsx";
import { first, uniq } from "lodash-es";
import React, { useMemo } from "react";

export interface ISummedUsageRecordListControlsProps {
  year: number;
  month: number;
  options: Record<number, number[]>;
  disabled?: boolean;
  onChange: (year: number, month?: number) => void;
}

const monthLabels = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const monthLabelsMap = Object.values(monthLabels).reduce((acc, key, index) => {
  acc[key] = index;
  return acc;
}, {} as Record<string, number>);

const SummedUsageRecordListControls: React.FC<
  ISummedUsageRecordListControlsProps
> = (props) => {
  const { year, month, options, disabled, onChange } = props;

  const { monthOptions, monthList } = useMemo(() => {
    const monthList = uniq((options[year] ?? []).concat(month).map(Number));
    const monthOptions = monthList.map((iMonth) => ({
      label: monthLabels[iMonth],
      value: monthLabels[iMonth],
    }));

    return { monthOptions, monthList };
  }, [options, year, month]);

  const { yearOptions } = useMemo(() => {
    const yearOptions = uniq(Object.keys(options).map(Number).concat(year)).map(
      (iYear) => ({
        label: iYear,
        value: iYear,
      })
    );

    return { yearOptions };
  }, [options, year]);

  return (
    <div className="flex items-center space-x-2">
      <Select
        disabled={disabled}
        onValueChange={(value) => onChange(Number(value), first(monthList))}
        defaultValue={year.toString()}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Year" />
        </SelectTrigger>
        <SelectContent>
          {yearOptions.map((y) => (
            <SelectItem key={y.value} value={y.value.toString()}>
              {y.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select
        disabled={disabled}
        onValueChange={(value) => onChange(year, monthLabelsMap[value])}
        defaultValue={monthLabels[month]?.toString()}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Year" />
        </SelectTrigger>
        <SelectContent>
          {monthOptions.map((m) => (
            <SelectItem key={m.value} value={m.value.toString()}>
              {m.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default SummedUsageRecordListControls;
