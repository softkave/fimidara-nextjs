import { File } from "fimidara";
import { isBoolean } from "lodash-es";
import { useState } from "react";
import FileForm from "../app/workspaces/files/FileForm.tsx";
import { ScrollArea } from "../ui/scroll-area.tsx";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet.tsx";

export function useFileForm(props: {
  workspaceId: string;
  workspaceRootname: string;
  folderpath?: string;
}) {
  const { workspaceId, workspaceRootname, folderpath } = props;
  const [formOpen, setFormOpen] = useState<File | boolean>(false);

  const isNewResourceForm = isBoolean(formOpen);
  const node = (
    <Sheet open={!!formOpen} onOpenChange={setFormOpen}>
      <SheetContent className="sm:w-[500px] p-0">
        <div className="h-full max-h-full">
          <ScrollArea className="h-full overflow-y-auto p-6">
            <SheetHeader>
              <SheetTitle>
                {isNewResourceForm ? "New Files" : "Update File"}
              </SheetTitle>
            </SheetHeader>
            <FileForm
              workspaceRootname={workspaceRootname}
              workspaceId={workspaceId}
              file={isBoolean(formOpen) ? undefined : formOpen}
              className="mt-8"
              folderpath={folderpath}
            />
          </ScrollArea>
        </div>
      </SheetContent>
    </Sheet>
  );

  return { setFormOpen, node };
}
