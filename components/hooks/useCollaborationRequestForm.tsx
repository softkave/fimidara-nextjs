import { CollaborationRequestForWorkspace } from "fimidara";
import { isBoolean } from "lodash-es";
import { useState } from "react";
import RequestForm from "../app/workspaces/requests/RequestForm.tsx";
import { Sheet, SheetContent, SheetTitle } from "../ui/sheet.tsx";

export function useCollaborationRequestForm(props: { workspaceId: string }) {
  const { workspaceId } = props;
  const [formOpen, setFormOpen] = useState<
    CollaborationRequestForWorkspace | boolean
  >(false);

  const isNewResourceForm = isBoolean(formOpen);
  const node = formOpen && (
    <Sheet open={!!formOpen} onOpenChange={setFormOpen}>
      <SheetContent className="sm:w-[420px]">
        <SheetTitle>
          {isNewResourceForm
            ? "New Collaboration Request"
            : "Update Collaboration Request"}
        </SheetTitle>
        <RequestForm
          workspaceId={workspaceId}
          request={isBoolean(formOpen) ? undefined : formOpen}
          className="mt-8"
        />
      </SheetContent>
    </Sheet>
  );

  return { setFormOpen, node };
}
