import { cx } from "@emotion/css";
import { Pagination, PaginationProps } from "antd";
import React from "react";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";
import CustomIcon from "../buttons/CustomIcon";
import IconButton from "../buttons/IconButton";
import { StyleableComponentProps } from "../styling/types";
import { appClasses } from "../theme";
import { IPaginationData } from "./utils";

export interface IPaginatedContentProps
  extends IPaginationData,
    StyleableComponentProps {}

function PaginatedContent(props: IPaginatedContentProps) {
  const {
    className,
    style,
    count,
    page,
    pageSize,
    disabled,
    setPage,
    setPageSize,
  } = props;

  const onPaginationChange = (inputPage: number, inputPageSize: number) => {
    if (page !== inputPage) setPage(inputPage);
    if (pageSize !== inputPageSize) setPageSize(inputPageSize);
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
      total={count}
      pageSize={pageSize}
      disabled={disabled}
      className={className}
      itemRender={itemRender}
      style={style}
    />
  );
}

export default React.memo(PaginatedContent as React.FC<IPaginatedContentProps>);
