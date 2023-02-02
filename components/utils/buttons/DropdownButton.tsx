import { CaretDownOutlined } from "@ant-design/icons";
import { Dropdown, DropdownProps, MenuProps } from "antd";
import React from "react";
import ButtonGroup from "./ButtonGroup";
import IconButton from "./IconButton";

export interface IDropdownButtonProps extends Pick<DropdownProps, "trigger"> {
  style?: React.CSSProperties;
  className?: string;
  menu: MenuProps;
  triggerNode?: React.ReactNode;
  disabled?: boolean;
  children?: React.ReactNode;
}

const DropdownButton: React.FC<IDropdownButtonProps> = (props) => {
  const { style, className, children, menu, trigger, disabled, triggerNode } = props;
  return (
    <ButtonGroup className={className} style={style}>
      {children}
      <Dropdown menu={menu} trigger={trigger || ["click"]} disabled={disabled}>
        {triggerNode || <IconButton icon={<CaretDownOutlined />} disabled={disabled} />}
      </Dropdown>
    </ButtonGroup>
  );
};

export default React.memo(DropdownButton);
