import { PermissionGroup } from "fimidara";
import { isBoolean } from "lodash-es";
import { useState } from "react";
import PermissionGroupForm from "../app/workspaces/permissionGroups/PermissionGroupForm.tsx";
import { Sheet, SheetContent, SheetTitle } from "../ui/sheet.tsx";

export function usePermissionGroupForm(props: { workspaceId: string }) {
  const { workspaceId } = props;
  const [formOpen, setFormOpen] = useState<PermissionGroup | boolean>(false);

  const isNewResourceForm = isBoolean(formOpen);
  const node = formOpen && (
    <Sheet open={!!formOpen} onOpenChange={setFormOpen}>
      <SheetContent className="w-full max-w-[420px] p-0">
        <SheetTitle className="p-6">
          {isNewResourceForm
            ? "New Permission Group"
            : "Update Permission Group"}
        </SheetTitle>
        <PermissionGroupForm
          workspaceId={workspaceId}
          permissionGroup={isBoolean(formOpen) ? undefined : formOpen}
          className="p-6 pt-0"
        />
      </SheetContent>
    </Sheet>
  );

  return { setFormOpen, node };
}
