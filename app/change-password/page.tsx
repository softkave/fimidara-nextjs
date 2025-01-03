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
import { useToast } from "@/hooks/use-toast.ts";
import { kAppWorkspacePaths } from "@/lib/definitions/paths/workspace.ts";
import { systemConstants } from "@/lib/definitions/system.ts";
import { userConstants } from "@/lib/definitions/user.ts";
import { useUserChangePasswordWithTokenMutationHook } from "@/lib/hooks/mutationHooks.ts";
import { useFormHelpers } from "@/lib/hooks/useFormHelpers.ts";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

export interface IChangePasswordWithTokenFormData {
  password: string;
}

interface IChangePasswordWithTokenFormInternalData
  extends IChangePasswordWithTokenFormData {
  // confirmPassword: string;
}

export interface IChangePasswordWithTokeneProps {}

const formSchema = z.object({
  password: z
    .string()
    .min(userConstants.minPasswordLength)
    .max(userConstants.maxPasswordLength),
});

export default function ChangePasswordWithToken(
  props: IChangePasswordWithTokeneProps
) {
  const router = useRouter();
  const { toast } = useToast();
  const changePasswordHook = useUserChangePasswordWithTokenMutationHook({
    onSuccess(data, params) {
      router.push(kAppWorkspacePaths.workspaces);
    },
  });
  const onSubmit = async (body: z.infer<typeof formSchema>) => {
    const query = new URLSearchParams(window.location.search);
    const token = query.get(systemConstants.tokenQueryKey);

    if (!token) {
      toast({
        title: "Change password token not found",
        description:
          "Please ensure you are using the change password link sent to your email address",
      });

      return;
    }

    return await changePasswordHook.runAsync(body, { authToken: token });
  };
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {},
  });

  useFormHelpers(form, { errors: changePasswordHook.error });

  const passwordNode = (
    <FormField
      control={form.control}
      name="password"
      render={({ field }) => (
        <FormItem>
          <FormLabel required>Password</FormLabel>
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

  return (
    <div className={styles.formBody}>
      <div className={styles.formContentWrapper}>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="mb-4">
              <h2 className="text-xl">Change Password</h2>
            </div>
            <FormAlert error={changePasswordHook.error} />
            {passwordNode}
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
