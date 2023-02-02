import { cx } from "@emotion/css";
import { defaultTo } from "lodash";
import React from "react";
import { GridHelpers, GridPortions, GridTemplateLayout } from "../styling/grid";
import { appClasses } from "../theme";
import { AppPagination, IAppPaginationProps } from "./AppPagination";

export interface IPaginatedContentProps {
  header?: React.ReactNode;
  content?: React.ReactNode;
  pagination?: IAppPaginationProps;
  className?: string;
  style?: React.CSSProperties;
}

export function PaginatedContent(props: IPaginatedContentProps) {
  const { header, content, pagination, className, style } = props;
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
      {pagination && <AppPagination {...pagination} />}
    </div>
  );
}
