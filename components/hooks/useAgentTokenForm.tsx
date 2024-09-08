import { AgentToken } from "fimidara";
import { isBoolean } from "lodash-es";
import { useState } from "react";
import AgentTokenForm from "../app/workspaces/agentTokens/AgentTokenForm.tsx";
import { Sheet, SheetContent, SheetTitle } from "../ui/sheet.tsx";

export function useAgentTokenForm(props: { workspaceId: string }) {
  const { workspaceId } = props;
  const [formOpen, setFormOpen] = useState<AgentToken | boolean>(false);

  const isNewResourceForm = isBoolean(formOpen);
  const node = formOpen && (
    <Sheet open={!!formOpen} onOpenChange={setFormOpen}>
      <SheetContent className="w-full sm:w-[500px]">
        <SheetTitle>
          {isNewResourceForm ? "New Agent Token" : "Update Agent Token"}
        </SheetTitle>
        <AgentTokenForm
          workspaceId={workspaceId}
          agentToken={isBoolean(formOpen) ? undefined : formOpen}
          className="mt-8"
        />
      </SheetContent>
    </Sheet>
  );

  return { setFormOpen, node };
}
