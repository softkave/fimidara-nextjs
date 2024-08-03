import { Select } from "antd";
import { first } from "lodash-es";
import React from "react";

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
  const yearOption = options[year] ?? [];

  return (
    <div className="flex align-center space-x-2">
      <Select
        value={year}
        onChange={(value) => onChange(value, first(yearOption))}
        disabled={disabled}
      >
        {Object.keys(options).map((year) => (
          <Select.Option key={year} value={year}>
            {year}
          </Select.Option>
        ))}
      </Select>
      <Select
        disabled={disabled}
        value={monthLabels[month]}
        onChange={(value) => onChange(year, monthLabelsMap[value])}
        options={yearOption.map((month) => ({
          label: monthLabels[month],
          value: monthLabels[month],
        }))}
      />
    </div>
  );
};

export default SummedUsageRecordListControls;
