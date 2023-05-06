export interface INewAgentTokenInput {
  expires?: number;
  providedResourceId?: string;
}

export const agentTokenConstants = { providedResourceMaxLength: 300 };
