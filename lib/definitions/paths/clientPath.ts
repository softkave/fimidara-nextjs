import { systemConstants } from "../system.ts";

export const kClientPaths = {
  withURL(path: string) {
    return `${systemConstants.baseUrl}${path}`;
  },
};
