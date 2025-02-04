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
import { cn } from "@/components/utils.ts";
import styles from "@/components/utils/form/form.module.css";
import { useToast } from "@/hooks/use-toast.ts";
import { userConstants } from "@/lib/definitions/user";
import { useUserChangePasswordWithCurrentPasswordMutationHook } from "@/lib/hooks/mutationHooks";
import { useFormHelpers } from "@/lib/hooks/useFormHelpers.ts";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { FormAlert } from "../../utils/FormAlert";

const validationSchema = z.object({
  password: z
    .string()
    .min(userConstants.minPasswordLength)
    .max(userConstants.maxPasswordLength),
  currentPassword: z
    .string({ required_error: "current password is required" })
    .min(1),
});

export default function ChangePasswordWithCurrentPassword() {
  const { toast } = useToast();
  const changePasswordHook =
    useUserChangePasswordWithCurrentPasswordMutationHook({
      onSuccess(data, params) {
        toast({ description: "Password changed" });
      },
    });

  const form = useForm<z.infer<typeof validationSchema>>({
    resolver: zodResolver(validationSchema),
    defaultValues: {
      password: "",
      currentPassword: "",
    },
  });

  const onSubmit = (body: z.infer<typeof validationSchema>) => {
    return changePasswordHook.runAsync(body);
  };

  useFormHelpers(form, { errors: changePasswordHook.error });

  const newPasswordNode = (
    <FormField
      control={form.control}
      name="password"
      render={({ field }) => (
        <FormItem>
          <FormLabel required>New Password</FormLabel>
          <FormControl>
            <Input
              {...field}
              type="password"
              autoComplete="new-password"
              placeholder="Enter new password"
              maxLength={userConstants.maxPasswordLength}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );

  const currentPasswordNode = (
    <FormField
      control={form.control}
      name="currentPassword"
      render={({ field }) => (
        <FormItem>
          <FormLabel required>Current Password</FormLabel>
          <FormControl>
            <Input
              {...field}
              type="password"
              autoComplete="current-password"
              placeholder="Enter current password"
              maxLength={userConstants.maxPasswordLength}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );

  return (
    <div className={styles.formBody}>
      <div className={cn(styles.formContentWrapper, "py-4")}>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormAlert error={changePasswordHook.error} />
            {currentPasswordNode}
            {newPasswordNode}
            <div className="my-4">
              <Button type="submit" loading={changePasswordHook.loading}>
                Change Password
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
