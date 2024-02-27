export interface IPaginationData {
  page: number;
  pageSize: number;
  count: number;
  setPage: (p: number) => void;
  setPageSize: (s: number) => void;
  disabled?: boolean;
}
