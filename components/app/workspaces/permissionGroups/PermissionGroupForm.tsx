import { Button } from "@/components/ui/button.tsx";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Textarea } from "@/components/ui/textarea.tsx";
import { cn } from "@/components/utils.ts";
import { FormAlert } from "@/components/utils/FormAlert";
import { useToast } from "@/hooks/use-toast.ts";
import { kAppWorkspacePaths } from "@/lib/definitions/paths/workspace.ts";
import { INewPermissionGroupInput } from "@/lib/definitions/permissionGroups";
import { systemConstants } from "@/lib/definitions/system";
import {
  useWorkspacePermissionGroupAddMutationHook,
  useWorkspacePermissionGroupUpdateMutationHook,
} from "@/lib/hooks/mutationHooks";
import { useFormHelpers } from "@/lib/hooks/useFormHelpers.ts";
import { systemValidation } from "@/lib/validation/system";
import { zodResolver } from "@hookform/resolvers/zod";
import { PermissionGroup } from "fimidara";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

const permissionGroupValidation = z.object({
  name: systemValidation.name,
  description: systemValidation.description,
});

function getPermissionGroupFormInputFromPermissionGroup(
  item: PermissionGroup
): INewPermissionGroupInput {
  return {
    name: item.name,
    description: item.description,
  };
}

export interface IPermissionGroupFormProps {
  permissionGroup?: PermissionGroup;
  className?: string;
  workspaceId: string;
}

export default function PermissionGroupForm(props: IPermissionGroupFormProps) {
  const { permissionGroup, className, workspaceId } = props;
  const { toast } = useToast();
  const router = useRouter();
  const updateHook = useWorkspacePermissionGroupUpdateMutationHook({
    onSuccess(data, params) {
      toast({ description: "Permission group updated" });
      router.push(
        kAppWorkspacePaths.permissionGroup(
          data.body.permissionGroup.workspaceId,
          data.body.permissionGroup.resourceId
        )
      );
    },
  });
  const createHook = useWorkspacePermissionGroupAddMutationHook({
    onSuccess(data, params) {
      toast({ description: "Permission group created" });
      router.push(
        kAppWorkspacePaths.permissionGroup(
          data.body.permissionGroup.workspaceId,
          data.body.permissionGroup.resourceId
        )
      );
    },
  });
  const mergedHook = permissionGroup ? updateHook : createHook;

  const onSubmit = (body: z.infer<typeof permissionGroupValidation>) =>
    permissionGroup
      ? updateHook.runAsync({
          body: {
            permissionGroupId: permissionGroup.resourceId,
            data: body,
          },
        })
      : createHook.runAsync({
          body: { workspaceId, permissionGroup: body },
        });

  const form = useForm<z.infer<typeof permissionGroupValidation>>({
    resolver: zodResolver(permissionGroupValidation),
    defaultValues: permissionGroup
      ? getPermissionGroupFormInputFromPermissionGroup(permissionGroup)
      : {},
  });

  useFormHelpers(form, { errors: mergedHook.error });

  const nameNode = (
    <FormField
      control={form.control}
      name="name"
      render={({ field }) => (
        <FormItem>
          <FormLabel required>Permission Group Name</FormLabel>
          <FormControl>
            <Input
              {...field}
              maxLength={systemConstants.maxNameLength}
              placeholder="Enter permission group name"
              autoComplete="off"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );

  const descriptionNode = (
    <FormField
      control={form.control}
      name="description"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Description</FormLabel>
          <FormControl>
            <Textarea
              {...field}
              name="description"
              placeholder="Enter permission group description"
              maxLength={systemConstants.maxDescriptionLength}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn("space-y-8", className)}
      >
        <FormAlert error={mergedHook.error} />
        {nameNode}
        {descriptionNode}
        <div className="my-4">
          <Button type="submit" loading={mergedHook.loading}>
            {permissionGroup
              ? "Update Permission Group"
              : "Create Permission Group"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
