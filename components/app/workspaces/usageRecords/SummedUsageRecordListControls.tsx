import { Select } from "antd";
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
        value={year.toString()}
        onChange={(value) => onChange(Number(value), first(monthList))}
        disabled={disabled}
        options={yearOptions}
      />
      <Select
        disabled={disabled}
        value={monthLabels[month]?.toString()}
        onChange={(value) => onChange(year, monthLabelsMap[value])}
        options={monthOptions}
      />
    </div>
  );
};

export default SummedUsageRecordListControls;
