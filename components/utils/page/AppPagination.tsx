import { cx } from "@emotion/css";
import { Pagination, PaginationProps } from "antd";
import React from "react";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";
import CustomIcon from "../buttons/CustomIcon";
import IconButton from "../buttons/IconButton";
import { appClasses } from "../theme";

export interface IAppPaginationProps {
  page: number;
  pageSize: number;
  setPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;
  className?: string;
  style?: React.CSSProperties;
  disabled?: boolean;
}

export function AppPagination(props: IAppPaginationProps) {
  const { page, pageSize, className, style, disabled, setPage, setPageSize } =
    props;
  const onPaginationChange = (inputPage: number, inputPageSize: number) => {
    if (inputPage !== page) setPage(inputPage);
    if (inputPageSize !== pageSize) setPageSize(inputPageSize);
  };
  const itemRender: PaginationProps["itemRender"] = (
    _,
    type,
    originalElement
  ) => {
    if (type === "prev") {
      return (
        <IconButton
          icon={<CustomIcon icon={<FiArrowLeft />} />}
          className={appClasses.mr8Forced}
        />
      );
    }
    if (type === "next") {
      return (
        <IconButton
          icon={<CustomIcon icon={<FiArrowRight />} />}
          className={cx(appClasses.ml8Forced, appClasses.mr8Forced)}
        />
      );
    }
    return originalElement;
  };

  return (
    <Pagination
      size="small"
      hideOnSinglePage
      current={page}
      onChange={onPaginationChange}
      pageSize={pageSize}
      disabled={disabled}
      className={className}
      style={style}
      itemRender={itemRender}
    />
  );
}
