import { Button } from "@/components/ui/button.tsx";
import {
  DropdownItems,
  IDropdownItem,
} from "@/components/ui/dropdown-items.tsx";
import { CaretDownOutlined } from "@ant-design/icons";
import React from "react";
import ButtonGroup from "./ButtonGroup";

export interface IDropdownButtonProps {
  style?: React.CSSProperties;
  className?: string;
  items: Array<IDropdownItem>;
  onSelect?: (key: string) => void;
  triggerNode?: React.ReactNode;
  disabled?: boolean;
  children?: React.ReactNode;
}

const DropdownButton: React.FC<IDropdownButtonProps> = (props) => {
  const { style, className, children, items, onSelect, disabled, triggerNode } =
    props;
  return (
    <ButtonGroup className={className} style={style}>
      {children}
      <DropdownItems disabled={disabled} items={items} onSelect={onSelect}>
        {triggerNode || (
          <Button variant="outline" size="icon" disabled={disabled}>
            <CaretDownOutlined />
          </Button>
        )}
      </DropdownItems>
    </ButtonGroup>
  );
};

export default React.memo(DropdownButton);
