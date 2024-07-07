import { Radio, Space } from "antd";
import { isObject } from "lodash-es";
import React from "react";
import { IFormFieldRenderFnProps } from "./FormField";
import { IFormItemInputRadio } from "./types";

export interface IFormItemInputRadioProps
  extends IFormItemInputRadio,
    IFormFieldRenderFnProps {
  value?: string;
  disabled?: boolean;
  onChange: (v: string) => void;
}

const FormItemInputRadio: React.FC<IFormItemInputRadioProps> = (props) => {
  const {
    value,
    disabled,
    buttonStyle,
    optionType,
    direction,
    options,
    style,
    className,
    onChange,
  } = props;

  if (direction === "vertical") {
    return (
      <Radio.Group
        value={value}
        buttonStyle={buttonStyle}
        disabled={disabled}
        style={style}
        className={className}
        onChange={(evt) => onChange(evt.target.value)}
      >
        <Space direction="vertical">
          {options?.map((item) => {
            const { label, value } = isObject(item)
              ? item
              : { label: item, value: item };
            return optionType === "button" ? (
              <Radio.Button value={value}>{label}</Radio.Button>
            ) : (
              <Radio value={value}>{label}</Radio>
            );
          })}
        </Space>
      </Radio.Group>
    );
  }

  return (
    <Radio.Group
      value={value}
      options={options}
      optionType={optionType}
      buttonStyle={buttonStyle}
      disabled={disabled}
      style={style}
      className={className}
      onChange={(evt) => onChange(evt.target.value)}
    />
  );
};

export default React.memo(FormItemInputRadio);
