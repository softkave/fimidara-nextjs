import { systemConstants } from "../definitions/system";

export function getServerAddr() {
  return systemConstants.serverAddr;
}

export function withServerAddr(p: string) {
  return getServerAddr() + p;
}
