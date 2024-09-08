import { cn } from "@/components/utils.ts";
import { isString } from "lodash-es";
import { CSSProperties, ReactNode, FC, memo } from "react";

export interface IListHeaderProps {
  style?: CSSProperties;
  className?: string;
  label?: ReactNode;
  buttons?: ReactNode;
  secondaryControls?: ReactNode;
}

const ListHeader: FC<IListHeaderProps> = (props) => {
  const { buttons, className, label, style, secondaryControls } = props;

  if (!label && !buttons) return null;

  return (
    <div>
      <div className={cn("flex", "items-center", className)} style={style}>
        <div className="flex-1">
          {isString(label) ? <h5>{label}</h5> : label}
        </div>
        {buttons && <div>{buttons}</div>}
      </div>
      {secondaryControls && <div className="mt-3">{secondaryControls}</div>}
    </div>
  );
};

export default memo(ListHeader);
