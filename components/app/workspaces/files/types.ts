import type { RcFile } from "antd/lib/upload";

export type SingleFileFormValue = {
  __localId: string;
  resourceId?: string;
  description?: string | null;
  encoding?: string;
  mimetype?: string;
  file?: RcFile;
  name: string;
};
