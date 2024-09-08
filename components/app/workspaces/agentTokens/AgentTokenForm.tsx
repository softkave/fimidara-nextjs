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
import { Input } from "@/components/ui/input.tsx";
import { Textarea } from "@/components/ui/textarea.tsx";
import { cn } from "@/components/utils.ts";
import { FormAlert } from "@/components/utils/FormAlert";
import { useToast } from "@/hooks/use-toast.ts";
import { agentTokenConstants } from "@/lib/definitions/agentToken";
import { appWorkspacePaths, systemConstants } from "@/lib/definitions/system";
import {
  useWorkspaceAgentTokenAddMutationHook,
  useWorkspaceAgentTokenUpdateMutationHook,
} from "@/lib/hooks/mutationHooks";
import { useFormHelpers } from "@/lib/hooks/useFormHelpers";
import { systemValidation } from "@/lib/validation/system.ts";
import { zodResolver } from "@hookform/resolvers/zod";
import { AgentToken, NewAgentTokenInput } from "fimidara";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  name: systemValidation.name,
  description: systemValidation.description,
  expires: z.number().optional(),
  providedResourceId: z
    .string()
    .max(agentTokenConstants.providedResourceMaxLength, {
      message: `${agentTokenConstants.providedResourceMaxLength} max chars`,
    })
    .nullable()
    .optional(),
});

function getAgentTokenFormInputFromToken(item: AgentToken): NewAgentTokenInput {
  return {
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
        appWorkspacePaths.agentToken(
          data.body.token.workspaceId,
          data.body.token.resourceId
        )
      );
    },
  });
  const createHook = useWorkspaceAgentTokenAddMutationHook({
    onSuccess(data, params) {
      toast({ title: "Agent token created" });
      router.push(
        appWorkspacePaths.agentToken(
          data.body.token.workspaceId,
          data.body.token.resourceId
        )
      );
    },
  });
  const mergedHook = agentToken ? updateHook : createHook;
  const onSubmit = (body: z.infer<typeof formSchema>) =>
    agentToken
      ? updateHook.runAsync({
          body: {
            tokenId: agentToken.resourceId,
            token: {
              ...body,
              providedResourceId: body.providedResourceId || undefined,
            },
          },
        })
      : createHook.runAsync({
          body: {
            workspaceId,
            token: {
              ...body,
              providedResourceId: body.providedResourceId || undefined,
            },
          },
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
          <FormLabel required>Token Name</FormLabel>
          <FormControl>
            <Input
              {...field}
              maxLength={systemConstants.maxNameLength}
              placeholder="Enter token name"
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
              placeholder="Enter token description"
              maxLength={systemConstants.maxDescriptionLength}
            />
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
            <DatePicker
              {...field}
              value={field.value ? new Date(field.value) : undefined}
              onChange={(date) => {
                form.setValue("expires", date?.valueOf());
              }}
            />
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
            <Textarea
              {...field}
              value={field.value || ""}
              placeholder="Enter token provided resource ID"
              maxLength={agentTokenConstants.providedResourceMaxLength}
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
