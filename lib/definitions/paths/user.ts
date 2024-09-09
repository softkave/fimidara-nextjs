export const kAppUserPaths = {
  settings: "/settings",
  requests: "/collaboration-requests",
  request(id: string) {
    return `${this.requests}/${id}`;
  },
  workspaces: "/workspaces",
};
