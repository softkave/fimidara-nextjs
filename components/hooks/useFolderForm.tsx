import { Folder } from "fimidara";
import { isBoolean } from "lodash-es";
import { useState } from "react";
import FolderForm from "../app/workspaces/files/FolderForm.tsx";
import { Sheet, SheetContent, SheetTitle } from "../ui/sheet.tsx";

export function useFolderForm(props: {
  workspaceId: string;
  workspaceRootname: string;
}) {
  const { workspaceId, workspaceRootname } = props;
  const [formOpen, setFormOpen] = useState<Folder | boolean>(false);

  const isNewResourceForm = isBoolean(formOpen);
  const node = formOpen && (
    <Sheet open={!!formOpen} onOpenChange={setFormOpen}>
      <SheetContent className="w-full sm:w-[500px]">
        <SheetTitle>
          {isNewResourceForm ? "New Folder" : "Update Folder"}
        </SheetTitle>
        <FolderForm
          workspaceRootname={workspaceRootname}
          workspaceId={workspaceId}
          folder={isBoolean(formOpen) ? undefined : formOpen}
          className="mt-8"
        />
      </SheetContent>
    </Sheet>
  );

  return { setFormOpen, node };
}
