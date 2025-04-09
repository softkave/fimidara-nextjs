import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet.tsx";
import { cn } from "@/components/utils.ts";
import {
  CSSProperties,
  forwardRef,
  ForwardRefRenderFunction,
  ReactNode,
  useCallback,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";

export interface IPageDrawerProps {
  open?: boolean;
  title: ReactNode;
  style?: CSSProperties;
  className?: string;
  children?: ReactNode;
  onClose?: () => void;
  titleClassName?: string;
  contentClassName?: string;
  side?: "left" | "right" | "top" | "bottom";
}

export interface IPageDrawerRef {
  isOpen: boolean;
  toggleOpen: () => void;
}

const PageDrawer: ForwardRefRenderFunction<IPageDrawerRef, IPageDrawerProps> = (
  props,
  ref
) => {
  const {
    open,
    title,
    style,
    className,
    children,
    onClose,
    titleClassName,
    contentClassName,
    side,
  } = props;
  const [isOpen, setOpen] = useState(open ?? false);

  const toggleOpen = useCallback(() => {
    setOpen((state) => !state);
    onClose && onClose();
  }, [onClose]);

  useEffect(() => {
    setOpen(open ?? false);
  }, [open]);

  useImperativeHandle<IPageDrawerRef, IPageDrawerRef>(
    ref,
    () => {
      return { isOpen, toggleOpen };
    },
    [isOpen, toggleOpen]
  );

  return (
    <Sheet open={isOpen} onOpenChange={toggleOpen}>
      <SheetContent
        className={cn("sm:w-full sm:max-w-[420px] p-4", className)}
        style={style}
        side={side}
      >
        <SheetTitle className={titleClassName}>{title}</SheetTitle>
        <div className={cn("pt-4 space-y-8", contentClassName)}>{children}</div>
      </SheetContent>
    </Sheet>
  );
};

export default forwardRef<IPageDrawerRef, IPageDrawerProps>(PageDrawer);
