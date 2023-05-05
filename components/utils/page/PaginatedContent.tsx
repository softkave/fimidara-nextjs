import { cx } from "@emotion/css";
import { defaultTo } from "lodash";
import React from "react";
import { GridHelpers, GridPortions, GridTemplateLayout } from "../styling/grid";
import { appClasses } from "../theme";
import PagePagination from "./PagePagination";
import { IPaginationData } from "./utils";

export interface IPaginatedContentProps {
  header?: React.ReactNode;
  content?: React.ReactNode;
  pagination?: IPaginationData;
  className?: string;
  paginationClassName?: string;
  style?: React.CSSProperties;
}

function PaginatedContent(props: IPaginatedContentProps) {
  const { header, content, pagination, className, style, paginationClassName } =
    props;

  const columnsLayout: GridTemplateLayout = [
    [GridHelpers.includePortion(header), GridPortions.Auto],
    [GridHelpers.includePortion(content), GridPortions.Fr(1)],
    [GridHelpers.includePortion(pagination), GridPortions.Auto],
  ];
  const rootStyle: React.CSSProperties = {
    ...defaultTo(style, {}),
    gridTemplateRows: GridHelpers.toStringGridTemplate(columnsLayout),
  };

  return (
    <div
      className={cx(appClasses.h100, appClasses.grid, className)}
      style={rootStyle}
    >
      {header}
      {content}
      {pagination && (
        <PagePagination {...pagination} className={paginationClassName} />
      )}
    </div>
  );
}

export default React.memo(PaginatedContent as React.FC<IPaginatedContentProps>);
