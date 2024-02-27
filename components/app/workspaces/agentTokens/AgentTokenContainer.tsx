import PageError from "@/components/utils/page/PageError";
import PageLoading from "@/components/utils/page/PageLoading";
import PageNothingFound from "@/components/utils/page/PageNothingFound";
import { useFetchSingleResourceFetchState } from "@/lib/hooks/fetchHookUtils";
import { useWorkspaceAgentTokenFetchHook } from "@/lib/hooks/singleResourceFetchHooks";
import { getBaseError } from "@/lib/utils/errors";
import { AgentToken } from "fimidara";
import React from "react";

export interface IAgentTokenContainerProps {
  tokenId: string;
  render: (agentToken: AgentToken) => React.ReactElement;
}

const AgentTokenContainer: React.FC<IAgentTokenContainerProps> = (
  props: IAgentTokenContainerProps
) => {
  const { tokenId, render } = props;
  const { fetchState } = useWorkspaceAgentTokenFetchHook({ tokenId });
  const { isLoading, error, resource } =
    useFetchSingleResourceFetchState(fetchState);

  if (resource) {
    return render(resource);
  } else if (error) {
    return (
      <PageError
        message={getBaseError(error) || "Error fetching agent assigned token"}
      />
    );
  } else if (isLoading) {
    return <PageLoading message="Loading agent assigned token..." />;
  } else {
    return <PageNothingFound message="Agent token not found" />;
  }
};

export default AgentTokenContainer;
