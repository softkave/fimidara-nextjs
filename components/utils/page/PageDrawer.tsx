import { css, cx } from "@emotion/css";
import { useResponsive } from "ahooks";
import { Drawer, DrawerProps } from "antd";
import React from "react";
import { FiArrowLeft } from "react-icons/fi";
import IconButton from "../buttons/IconButton";

export interface IPageDrawerProps {
  open?: boolean;
  closable?: boolean;
  title: React.ReactNode;
  extra?: React.ReactNode;
  placement?: DrawerProps["placement"];
  style?: React.CSSProperties;
  className?: string;
  children?: React.ReactNode;
  onClose?: () => void;
}

export interface IPageDrawerRef {
  isOpen: boolean;
  toggleOpen: () => void;
}

const classes = {
  root: css({
    "& .ant-drawer-header": { padding: "16px" },
    "& .ant-drawer-close": { padding: "0px" },
  }),
};

const PageDrawer: React.ForwardRefRenderFunction<
  IPageDrawerRef,
  IPageDrawerProps
> = (props, ref) => {
  const {
    open,
    closable,
    title,
    placement,
    style,
    className,
    extra,
    children,
    onClose,
  } = props;
  const [isOpen, setOpen] = React.useState(open ?? false);
  const toggleOpen = React.useCallback(() => {
    setOpen((state) => !state);
    onClose && onClose();
  }, [onClose]);

  React.useEffect(() => {
    setOpen(open ?? false);
  }, [open]);

  const responsive = useResponsive();
  const drawerWidth = responsive.md ? 500 : window.innerWidth;

  React.useImperativeHandle<IPageDrawerRef, IPageDrawerRef>(
    ref,
    () => {
      return { isOpen, toggleOpen };
    },
    [isOpen, toggleOpen]
  );

  return (
    <Drawer
      destroyOnClose
      title={title}
      closable={closable}
      placement={placement || "right"}
      onClose={toggleOpen}
      open={isOpen}
      closeIcon={<IconButton icon={<FiArrowLeft />} />}
      style={style}
      className={cx(className, classes.root)}
      width={drawerWidth}
      extra={extra}
    >
      {children}
    </Drawer>
  );
};

export default React.forwardRef<IPageDrawerRef, IPageDrawerProps>(PageDrawer);
