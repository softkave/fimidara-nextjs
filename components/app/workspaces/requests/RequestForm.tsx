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
import styles from "@/components/utils/form/form.module.css";
import { FormAlert } from "@/components/utils/FormAlert";
import { useToast } from "@/hooks/use-toast.ts";
import { ICollaborationRequestInput } from "@/lib/definitions/collaborationRequest";
import { appWorkspacePaths, systemConstants } from "@/lib/definitions/system";
import {
  useWorkspaceCollaborationRequestAddMutationHook,
  useWorkspaceCollaborationRequestUpdateMutationHook,
} from "@/lib/hooks/mutationHooks";
import { useFormHelpers } from "@/lib/hooks/useFormHelpers.ts";
import { cn } from "@/lib/utils.ts";
import { zodResolver } from "@hookform/resolvers/zod";
import { CollaborationRequestForWorkspace } from "fimidara";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

const requestValidation = z.object({
  recipientEmail: z
    .string({ required_error: "recipient email is required" })
    .trim()
    .email(),
  message: z.string().max(systemConstants.maxDescriptionLength),
  expires: z.number().optional(),
});

function getRequestFormInputFromRequest(
  item: CollaborationRequestForWorkspace
): ICollaborationRequestInput {
  return {
    recipientEmail: item.recipientEmail,
    message: item.message,
    expires: item.expiresAt ? new Date(item.expiresAt).valueOf() : undefined,
  };
}

export interface IRequestFormProps {
  request?: CollaborationRequestForWorkspace;
  className?: string;
  workspaceId: string;
}

export default function RequestForm(props: IRequestFormProps) {
  const { request, className, workspaceId } = props;
  const { toast } = useToast();
  const router = useRouter();
  const updateHook = useWorkspaceCollaborationRequestUpdateMutationHook({
    onSuccess(data, params) {
      toast({ title: "Collaboration request updated" });
      router.push(
        appWorkspacePaths.request(
          data.body.request.workspaceId,
          data.body.request.resourceId
        )
      );
    },
  });
  const createHook = useWorkspaceCollaborationRequestAddMutationHook({
    onSuccess(data, params) {
      toast({ title: "Collaboration request created" });
      router.push(
        appWorkspacePaths.request(
          data.body.request.workspaceId,
          data.body.request.resourceId
        )
      );
    },
  });
  const mergedHook = request ? updateHook : createHook;

  const onSubmit = (body: z.infer<typeof requestValidation>) =>
    request
      ? updateHook.runAsync({
          body: {
            requestId: request.resourceId,
            request: {
              message: body.message,
              expires: body.expires,
            },
          },
        })
      : createHook.runAsync({
          body: {
            workspaceId,
            request: body,
          },
        });

  const form = useForm<z.infer<typeof requestValidation>>({
    resolver: zodResolver(requestValidation),
    defaultValues: request ? getRequestFormInputFromRequest(request) : {},
  });

  useFormHelpers(form, { errors: mergedHook.error });

  const recipientEmailNode = (
    <FormField
      control={form.control}
      name="recipientEmail"
      render={({ field }) => (
        <FormItem>
          <FormLabel required>Recipient Email Address</FormLabel>
          <FormControl>
            <Input
              {...field}
              maxLength={systemConstants.maxNameLength}
              placeholder="Enter recipient email"
              autoComplete="off"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );

  const messageNode = (
    <FormField
      control={form.control}
      name="message"
      render={({ field }) => (
        <FormItem>
          <FormLabel required>Message</FormLabel>
          <FormControl>
            <Textarea
              {...field}
              placeholder="Enter request message"
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

  return (
    <div className={cn(styles.formBody, className)}>
      <div className={styles.formContentWrapper}>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="mb-4">
              <h4>Collaboration Request Form</h4>
            </div>
            <FormAlert error={mergedHook.error} />
            {recipientEmailNode}
            {messageNode}
            {expiresNode}
            <div className="my-4">
              <Button type="submit" loading={mergedHook.loading}>
                {request ? "Update Request" : "Create Request"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
