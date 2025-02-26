import { Folder } from "fimidara";
import { isBoolean } from "lodash-es";
import { useState } from "react";
import FolderForm from "../app/workspaces/files/FolderForm.tsx";
import { ScrollArea } from "../ui/scroll-area.tsx";
import { Sheet, SheetContent, SheetTitle } from "../ui/sheet.tsx";

export function useFolderForm(props: {
  workspaceId: string;
  workspaceRootname: string;
  folderpath?: string;
}) {
  const { workspaceId, workspaceRootname, folderpath } = props;
  const [formOpen, setFormOpen] = useState<Folder | boolean>(false);

  const isNewResourceForm = isBoolean(formOpen);
  const node = formOpen && (
    <Sheet open={!!formOpen} onOpenChange={setFormOpen}>
      <SheetContent className="sm:w-[500px] p-0">
        <ScrollArea className="p-6 h-full overflow-y-auto">
          <SheetTitle>
            {isNewResourceForm ? "New Folder" : "Update Folder"}
          </SheetTitle>
          <FolderForm
            workspaceRootname={workspaceRootname}
            workspaceId={workspaceId}
            folder={isBoolean(formOpen) ? undefined : formOpen}
            className="mt-8"
            parentPath={folderpath}
          />
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );

  return { setFormOpen, node };
}
