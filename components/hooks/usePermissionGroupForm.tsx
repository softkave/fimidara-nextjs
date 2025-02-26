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
      <SheetContent className="sm:w-[420px]">
        <SheetTitle>
          {isNewResourceForm
            ? "New Permission Group"
            : "Update Permission Group"}
        </SheetTitle>
        <PermissionGroupForm
          workspaceId={workspaceId}
          permissionGroup={isBoolean(formOpen) ? undefined : formOpen}
          className="mt-8"
        />
      </SheetContent>
    </Sheet>
  );

  return { setFormOpen, node };
}
