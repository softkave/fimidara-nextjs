import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination.tsx";
import React, { ReactElement } from "react";
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
    if (disabled) return;

    if (page !== inputPage) {
      setPage(inputPage);
    }

    if (pageSize !== inputPageSize) {
      setPageSize(inputPageSize);
    }
  };

  let pNode: ReactElement = <></>;
  const maxPage = Math.ceil(count / pageSize);
  const pMax = Math.min(3, maxPage);
  const pStart = Math.max(0, page - 1);
  const pList = Array.from({ length: pMax }, (_, i) => pStart + i);
  const hasEllipsis = pList.length < maxPage;

  if (count > 0 && pList.length && maxPage > 1) {
    pNode = (
      <Pagination className={className} style={style}>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              disabled={page === 0 || disabled}
              onClick={() => onPaginationChange(page - 1, pageSize)}
            />
          </PaginationItem>
          {pList.map((p) => (
            <PaginationItem key={p}>
              <PaginationLink
                href="#"
                isActive={p === page}
                disabled={disabled}
                onClick={() => onPaginationChange(p, pageSize)}
              >
                {p + 1}
              </PaginationLink>
            </PaginationItem>
          ))}
          {hasEllipsis && (
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          )}
          <PaginationItem>
            <PaginationNext
              href="#"
              disabled={page + 1 === maxPage || disabled}
              onClick={() => onPaginationChange(page + 1, pageSize)}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );
  }

  // TODO: show count
  return pNode;
}

export default React.memo(PaginatedContent as React.FC<IPaginatedContentProps>);
