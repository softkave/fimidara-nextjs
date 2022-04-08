const serverAddr =
  process.env.NODE_ENV === "development"
    ? `http://localhost:5000`
    : "https://api.files.softkave.com";

const clientAddr =
  process.env.NODE_ENV === "development"
    ? `http://localhost:3000`
    : "https://files.softkave.com";

export function getServerAddr() {
  return serverAddr;
}

export function getClientAddr() {
  return clientAddr;
}

export function withServerAddr(p: string) {
  return getServerAddr() + p;
}
