import { File } from "fimidara";
import { isBoolean } from "lodash-es";
import { useState } from "react";
import FileForm from "../app/workspaces/files/FileForm.tsx";
import { ScrollArea } from "../ui/scroll-area.tsx";
import { Sheet, SheetContent, SheetTitle } from "../ui/sheet.tsx";

export function useFileForm(props: {
  workspaceId: string;
  workspaceRootname: string;
}) {
  const { workspaceId, workspaceRootname } = props;
  const [formOpen, setFormOpen] = useState<File | boolean>(false);

  const isNewResourceForm = isBoolean(formOpen);
  const node = formOpen && (
    <Sheet open={!!formOpen} onOpenChange={setFormOpen}>
      <SheetContent className="w-full sm:w-[500px] p-0">
        <ScrollArea className="p-6 h-full overflow-y-auto">
          <SheetTitle>
            {isNewResourceForm ? "New Files" : "Update File"}
          </SheetTitle>
          <FileForm
            workspaceRootname={workspaceRootname}
            workspaceId={workspaceId}
            file={isBoolean(formOpen) ? undefined : formOpen}
            className="mt-8"
          />
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );

  return { setFormOpen, node };
}
