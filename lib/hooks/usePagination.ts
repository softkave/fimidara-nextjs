import React from "react";
import { IPaginationQuery } from "../api/types";
import { systemConstants } from "../definitions/system";

export default function usePagination(defaults?: IPaginationQuery) {
  const [page, setPage] = React.useState(
    defaults?.page ?? systemConstants.defaultPage
  );
  const [pageSize, setPageSize] = React.useState(
    defaults?.page ?? systemConstants.defaultPageSize
  );
  return { page, pageSize, setPage, setPageSize };
}
