import { cx } from "@emotion/css";
import { Pagination, PaginationProps } from "antd";
import { defaultTo } from "lodash";
import React from "react";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";
import CustomIcon from "../buttons/CustomIcon";
import IconButton from "../buttons/IconButton";
import { GridHelpers, GridPortions, GridTemplateLayout } from "../styling/grid";
import { appClasses } from "../theme";
import { IPaginationData } from "./utils";

export interface IPaginatedContentProps {
  header?: React.ReactNode;
  content?: React.ReactNode;
  pagination?: IPaginationData;
  className?: string;
  paginationClassNamee?: string;
  style?: React.CSSProperties;
}

function PaginatedContent(props: IPaginatedContentProps) {
  const {
    header,
    content,
    pagination,
    className,
    style,
    paginationClassNamee,
  } = props;
  const onPaginationChange = (page: number, pageSize: number) => {
    if (page !== pagination?.page) pagination?.setPage(page);
    if (pageSize !== pagination?.pageSize) pagination?.setPageSize(pageSize);
  };

  const columnsLayout: GridTemplateLayout = [
    [GridHelpers.includePortion(header), GridPortions.Auto],
    [GridHelpers.includePortion(content), GridPortions.Fr(1)],
    [GridHelpers.includePortion(pagination), GridPortions.Auto],
  ];
  const rootStyle: React.CSSProperties = {
    ...defaultTo(style, {}),
    gridTemplateRows: GridHelpers.toStringGridTemplate(columnsLayout),
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
    <div
      className={cx(appClasses.h100, appClasses.grid, className)}
      style={rootStyle}
    >
      {header}
      {content}
      {pagination && (
        <Pagination
          size="small"
          hideOnSinglePage
          current={pagination.page}
          onChange={onPaginationChange}
          total={pagination.count}
          pageSize={pagination.pageSize}
          disabled={pagination.disabled}
          className={paginationClassNamee}
          itemRender={itemRender}
        />
      )}
    </div>
  );
}

export default React.memo(PaginatedContent as React.FC<IPaginatedContentProps>);
