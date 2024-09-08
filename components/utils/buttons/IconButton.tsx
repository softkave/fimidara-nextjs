import { Button } from "@/components/ui/button.tsx";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Omit1 } from "@/lib/utils/types";
import React, { ComponentProps } from "react";

export interface IIconButtonProps {
  style?: React.CSSProperties;
  className?: string;
  disabled?: boolean;
  title?: string;
  icon: React.ReactNode;
  onClick?: () => void;
  buttonProps?: Partial<ComponentProps<typeof Button>>;
  children?: React.ReactNode;
}

export type IExtendsIconButtonProps = Omit1<IIconButtonProps, "icon">;

const IconButton: React.FC<IIconButtonProps> = (props) => {
  const {
    style,
    className,
    disabled,
    icon,
    title,
    onClick,
    buttonProps,
    children,
  } = props;

  const btnNode = (
    <Button
      {...buttonProps}
      disabled={disabled}
      onClick={onClick}
      className={className}
      style={style}
      variant="outline"
      size="icon"
    >
      {icon}
      {children}
    </Button>
  );

  return title ? (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>{btnNode}</TooltipTrigger>
        <TooltipContent>{title}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ) : (
    btnNode
  );
};

export default React.memo(IconButton);
