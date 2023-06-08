export interface INewWorkspaceInput {
  name: string;
  rootname: string;
  description?: string;
}

export type IUpdateWorkspaceInput = Partial<
  Omit<INewWorkspaceInput, "rootname">
>;
