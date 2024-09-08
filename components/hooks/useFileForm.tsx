import { File } from "fimidara";
import { isBoolean } from "lodash-es";
import { useState } from "react";
import FileForm from "../app/workspaces/files/FileForm.tsx";
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
      <SheetContent className="w-full sm:w-[500px]">
        <SheetTitle>
          {isNewResourceForm ? "New File" : "Update File"}
        </SheetTitle>
        <FileForm
          workspaceRootname={workspaceRootname}
          workspaceId={workspaceId}
          file={isBoolean(formOpen) ? undefined : formOpen}
          className="mt-8"
        />
      </SheetContent>
    </Sheet>
  );

  return { setFormOpen, node };
}
