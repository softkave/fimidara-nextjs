import React from "react";
import { cn } from "../utils.ts";

export interface IComponentHeaderProps {
  title: string;
  copyable?: boolean;
  className?: string;
  prefixNode?: React.ReactNode;
  children?: React.ReactNode;
}

const ComponentHeader: React.FC<IComponentHeaderProps> = (props) => {
  const { title, copyable, className, prefixNode, children } = props;

  // TODO: implement copyable

  return (
    <div className={cn("flex", className)}>
      {prefixNode && <div className="mr-8">{prefixNode}</div>}
      <h4 className="flex mr-8">{title}</h4>
      {children}
    </div>
  );
};

export default ComponentHeader;
