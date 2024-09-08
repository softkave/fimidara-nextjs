import { Button } from "@/components/ui/button.tsx";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form.tsx";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet.tsx";
import { cn } from "@/components/utils.ts";
import { FormAlert } from "@/components/utils/FormAlert";
import styles from "@/components/utils/form/form.module.css";
import { StyleableComponentProps } from "@/components/utils/styling/types";
import { useToast } from "@/hooks/use-toast.ts";
import { kPermissionGroupConstants } from "@/lib/definitions/permissionGroups";
import {
  useMergeMutationHookStates,
  useWorkspacePermissionGroupAssignMutationHook,
  useWorkspacePermissionGroupUnassignMutationHook,
} from "@/lib/hooks/mutationHooks";
import { useFormHelpers } from "@/lib/hooks/useFormHelpers.ts";
import { indexArray } from "@/lib/utils/indexArray";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo, useRef } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import PermissionGroupListContainer from "./PermissionGroupListContainer";

type AssignPermissionGroupsFormValues = {
  permissionGroups: string[];
};

const validationSchema = z.object({
  permissionGroups: z
    .array(z.string(), { required_error: "permission groups is required" })
    .max(kPermissionGroupConstants.maxAssignedPermissionGroups, {
      message: `${kPermissionGroupConstants.maxAssignedPermissionGroups} max chars`,
    }),
});

export interface IAssignPermissionGroupsFormProps
  extends StyleableComponentProps {
  entityId: string;
  workspaceId: string;
  permissionGroups: string[];
  onClose: () => void;
  onCompleteSubmit: () => void;
}

export default function AssignPermissionGroupsForm(
  props: IAssignPermissionGroupsFormProps
) {
  const {
    entityId,
    permissionGroups,
    className,
    style,
    workspaceId,
    onClose,
    onCompleteSubmit,
  } = props;
  const { toast } = useToast();

  const assignHook = useWorkspacePermissionGroupAssignMutationHook();
  const unassignHook = useWorkspacePermissionGroupUnassignMutationHook();
  const mergedHook = useMergeMutationHookStates(assignHook, unassignHook);

  const onSubmit = async (body: AssignPermissionGroupsFormValues) => {
    const initialPgsMap = indexArray(permissionGroups);
    const assignedPgsMap = indexArray(body.permissionGroups);
    const unassignedPgs = permissionGroups.filter(
      (pgId) => !assignedPgsMap[pgId]
    );
    const assignedPgs = body.permissionGroups.filter(
      (pgId) => !initialPgsMap[pgId]
    );

    // TODO: should we have different runs for assign and unassign?
    await Promise.all([
      assignedPgs.length &&
        assignHook.runAsync({
          body: {
            workspaceId,
            entityId: [entityId],
            permissionGroups: assignedPgs.map((pId) => ({
              permissionGroupId: pId,
            })),
          },
        }),
      unassignedPgs.length &&
        unassignHook.runAsync({
          body: {
            workspaceId,
            entityId: [entityId],
            permissionGroups: unassignedPgs,
          },
        }),
    ]);

    if (assignedPgs.length || unassignedPgs.length) {
      toast({ title: "Assigned permission groups updated" });
    }

    onCompleteSubmit();
    onClose();
  };

  const form = useForm<z.infer<typeof validationSchema>>({
    resolver: zodResolver(validationSchema),
    defaultValues: { permissionGroups },
  });

  useFormHelpers(form, { errors: mergedHook.error });

  const wPermissionGroups = form.watch("permissionGroups");
  const selectedMap = useMemo(() => {
    return indexArray(wPermissionGroups, {
      reducer: (item) => true,
    });
  }, [wPermissionGroups]);

  const permissionGroupsNode = (
    <FormField
      control={form.control}
      name="permissionGroups"
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <PermissionGroupListContainer
              withCheckbox
              workspaceId={workspaceId}
              selectedMap={selectedMap}
              onSelect={(pg) => {
                const idList = [...wPermissionGroups];
                const i = idList.indexOf(pg.resourceId);

                if (i === -1) idList.push(pg.resourceId);
                else idList.splice(i, 1);

                form.setValue("permissionGroups", idList);
              }}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );

  const formRef = useRef<HTMLFormElement>(null);

  const mainNode = (
    <div className={cn(styles.formBody, className)} style={style}>
      <div className={styles.formContentWrapper}>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8"
            ref={formRef}
          >
            <FormAlert error={mergedHook.error} />
            {permissionGroupsNode}
          </form>
        </Form>
      </div>
    </div>
  );

  return (
    <Sheet open onOpenChange={onClose}>
      <SheetContent className="w-full sm:w-[500px]">
        <SheetTitle>Assign Permission Groups</SheetTitle>
        <div className="pt-6 w-full space-y-8">
          {mainNode}
          <div>
            <Button
              loading={mergedHook.loading}
              onClick={() => formRef.current?.submit()}
            >
              Update
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
