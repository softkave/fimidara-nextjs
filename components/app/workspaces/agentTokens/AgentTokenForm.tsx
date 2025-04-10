import { Button } from "@/components/ui/button.tsx";
import { DatePicker } from "@/components/ui/datepicker.tsx";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form.tsx";
import { InputCounter } from "@/components/ui/input-counter.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Textarea } from "@/components/ui/textarea.tsx";
import { cn } from "@/components/utils.ts";
import { FormAlert } from "@/components/utils/FormAlert";
import { useToast } from "@/hooks/use-toast.ts";
import { agentTokenConstants } from "@/lib/definitions/agentToken";
import { kAppWorkspacePaths } from "@/lib/definitions/paths/workspace.ts";
import { systemConstants } from "@/lib/definitions/system";
import {
  useWorkspaceAgentTokenAddMutationHook,
  useWorkspaceAgentTokenUpdateMutationHook,
} from "@/lib/hooks/mutationHooks";
import { useFormHelpers } from "@/lib/hooks/useFormHelpers";
import { systemValidation } from "@/lib/validation/system.ts";
import { zodResolver } from "@hookform/resolvers/zod";
import { AgentToken } from "fimidara";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  name: systemValidation.name.optional(),
  description: systemValidation.description.optional(),
  expires: z.number().optional(),
  providedResourceId: z
    .string()
    .max(agentTokenConstants.providedResourceMaxLength, {
      message: `${agentTokenConstants.providedResourceMaxLength} max chars`,
    })
    .nullable()
    .optional(),
});

function getAgentTokenFormInputFromToken(
  item: AgentToken
): z.infer<typeof formSchema> {
  return {
    name: item.name,
    description: item.description,
    expires: item.expiresAt,
    providedResourceId: item.providedResourceId || undefined,
  };
}

export interface IAgentTokenFormProps {
  agentToken?: AgentToken;
  className?: string;
  workspaceId: string;
}

export default function AgentTokenForm(props: IAgentTokenFormProps) {
  const { agentToken, className, workspaceId } = props;
  const { toast } = useToast();
  const router = useRouter();
  const updateHook = useWorkspaceAgentTokenUpdateMutationHook({
    onSuccess(data, params) {
      toast({ title: "Agent token updated" });
      router.push(
        kAppWorkspacePaths.agentToken(
          data.token.workspaceId,
          data.token.resourceId
        )
      );
    },
  });
  const createHook = useWorkspaceAgentTokenAddMutationHook({
    onSuccess(data, params) {
      toast({ title: "Agent token created" });
      router.push(
        kAppWorkspacePaths.agentToken(
          data.token.workspaceId,
          data.token.resourceId
        )
      );
    },
  });
  const mergedHook = agentToken ? updateHook : createHook;
  const onSubmit = (body: z.infer<typeof formSchema>) =>
    agentToken
      ? updateHook.runAsync({
          tokenId: agentToken.resourceId,
          token: {
            ...body,
            providedResourceId: body.providedResourceId || undefined,
          },
        })
      : createHook.runAsync({
          workspaceId,
          ...body,
          providedResourceId: body.providedResourceId || undefined,
        });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: agentToken
      ? getAgentTokenFormInputFromToken(agentToken)
      : {},
  });

  useFormHelpers(form, { errors: mergedHook.error });

  const nameNode = (
    <FormField
      control={form.control}
      name="name"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Token Name</FormLabel>
          <FormControl>
            <div>
              <Input
                {...field}
                maxLength={systemConstants.maxNameLength}
                placeholder="Enter token name"
                autoComplete="off"
              />
              <InputCounter
                count={field.value?.length || 0}
                maxCount={systemConstants.maxNameLength}
                onTruncate={() => {
                  form.setValue(
                    "name",
                    field.value?.slice(0, systemConstants.maxNameLength)
                  );
                }}
                className="mt-1"
              />
            </div>
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
            <div>
              <Textarea
                {...field}
                name="description"
                placeholder="Enter token description"
                maxLength={systemConstants.maxDescriptionLength}
              />
              <InputCounter
                count={field.value?.length || 0}
                maxCount={systemConstants.maxDescriptionLength}
                onTruncate={() => {
                  form.setValue(
                    "description",
                    field.value?.slice(0, systemConstants.maxDescriptionLength)
                  );
                }}
                className="mt-1"
              />
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );

  const expiresNode = (
    <FormField
      control={form.control}
      name="expires"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Expires</FormLabel>
          <FormControl>
            <div className="block">
              <DatePicker
                {...field}
                value={field.value ? new Date(field.value) : undefined}
                onChange={(date) => {
                  form.setValue("expires", date?.valueOf());
                }}
              />
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );

  const providedResourceIdNode = (
    <FormField
      control={form.control}
      name="providedResourceId"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Provided Resource ID</FormLabel>
          <FormControl>
            <div>
              <Textarea
                {...field}
                value={field.value || ""}
                placeholder="Enter token provided resource ID"
                maxLength={agentTokenConstants.providedResourceMaxLength}
              />
              <InputCounter
                count={field.value?.length || 0}
                maxCount={agentTokenConstants.providedResourceMaxLength}
                onTruncate={() => {
                  form.setValue(
                    "providedResourceId",
                    field.value?.slice(
                      0,
                      agentTokenConstants.providedResourceMaxLength
                    )
                  );
                }}
                className="mt-1"
              />
            </div>
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
        {expiresNode}
        {providedResourceIdNode}
        <div className="my-4">
          <Button type="submit" loading={mergedHook.loading}>
            {agentToken ? "Update Token" : "Create Token"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
