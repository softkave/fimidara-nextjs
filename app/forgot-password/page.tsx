"use client";

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
import styles from "@/components/utils/form/form.module.css";
import { FormAlert } from "@/components/utils/FormAlert.tsx";
import { appComponentConstants } from "@/components/utils/utils.ts";
import { useToast } from "@/hooks/use-toast.ts";
import { useUserForgotPasswordMutationHook } from "@/lib/hooks/mutationHooks.ts";
import { useFormHelpers } from "@/lib/hooks/useFormHelpers.ts";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

export interface IForgotPasswordFormData {
  email: string;
}

interface IForgotPasswordFormInternalData extends IForgotPasswordFormData {
  // confirmEmail: string;
}

export interface IForgotPasswordProps {}

const formSchema = z.object({
  email: z.string().email(),
});

export default function ForgotPassword(props: IForgotPasswordProps) {
  const { toast } = useToast();
  const forgotHook = useUserForgotPasswordMutationHook({
    onSuccess(data, params) {
      toast({
        title: `You should see a change password email soon at ${params[0].body.email}`,
        duration: appComponentConstants.messageDuration,
      });
    },
  });
  const onSubmit = async (body: z.infer<typeof formSchema>) =>
    await forgotHook.runAsync({ body });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {},
  });

  useFormHelpers(form, { errors: forgotHook.error });

  const emailNode = (
    <FormField
      control={form.control}
      name="email"
      render={({ field }) => (
        <FormItem>
          <FormLabel required>Email Address</FormLabel>
          <FormControl>
            <Input
              {...field}
              autoComplete="email"
              placeholder="Enter your email address"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );

  return (
    <div className={styles.formBody}>
      <div className={styles.formContentWrapper}>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="mb-4">
              <h2 className="text-xl">Request Change Password</h2>
            </div>
            <FormAlert error={forgotHook.error} />
            {emailNode}
            <div className="my-4">
              <Button type="submit" loading={forgotHook.loading}>
                Send Change Password Email
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
