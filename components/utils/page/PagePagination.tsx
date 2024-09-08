import { Pagination, PaginationProps } from "antd";
import React from "react";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";
import CustomIcon from "../buttons/CustomIcon";
import IconButton from "../buttons/IconButton";
import { StyleableComponentProps } from "../styling/types";
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
    // fimidara's pagination is 0-based, but antd is not, we need to minus 1
    inputPage = inputPage - 1;

    if (page !== inputPage) {
      setPage(inputPage);
    }

    if (pageSize !== inputPageSize) {
      setPageSize(inputPageSize);
    }
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
          className="mr-2"
        />
      );
    }

    if (type === "next") {
      return (
        <IconButton
          icon={<CustomIcon icon={<FiArrowRight />} />}
          className="ml-2 mr-2"
        />
      );
    }

    return originalElement;
  };

  return (
    <Pagination
      hideOnSinglePage
      size="small"
      // fimidara's pagination is 0-based, but antd is not, we need to plus 1
      current={page + 1}
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
