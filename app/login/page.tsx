"use client";

import { Button } from "@/components/ui/button.tsx";
import { Checkbox } from "@/components/ui/checkbox.tsx";
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
import { appWorkspacePaths } from "@/lib/definitions/system.ts";
import { userConstants } from "@/lib/definitions/user.ts";
import { useUserLoginMutationHook } from "@/lib/hooks/mutationHooks/useUserLoginMutationHook.ts";
import { useFormHelpers } from "@/lib/hooks/useFormHelpers.ts";
import UserSessionStorageFns from "@/lib/storage/userSession.ts";
import { zodResolver } from "@hookform/resolvers/zod";
import { isBoolean, omit } from "lodash-es";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

export interface ILoginFormValues {
  email: string;
  password: string;
  remember: boolean;
}

export interface ILoginProps {}

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().max(userConstants.maxPasswordLength),
  remember: z.boolean().optional(),
});

export default function Login(props: ILoginProps) {
  const router = useRouter();
  const loginHook = useUserLoginMutationHook({
    onSuccess(data, params) {
      router.push(appWorkspacePaths.workspaces);
    },
  });
  const onSubmit = async (body: z.infer<typeof formSchema>) => {
    const result = await loginHook.runAsync({
      body: {
        email: body.email,
        password: body.password,
      },
    });

    if (body.remember) {
      UserSessionStorageFns.saveUserToken(result.body.token);
      UserSessionStorageFns.saveClientAssignedToken(
        result.body.clientAssignedToken
      );
    }
  };
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      remember: false,
    },
  });

  useFormHelpers(form, { errors: loginHook.error });

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
              autoComplete="current-password"
              placeholder="Enter your password"
              maxLength={userConstants.maxPasswordLength}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );

  const rememberNode = (
    <FormField
      control={form.control}
      name="remember"
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="remember"
                {...omit(field, ["value"])}
                checked={field.value}
                onCheckedChange={(state) => {
                  if (isBoolean(state)) form.setValue("remember", state);
                }}
              />
              <label
                htmlFor="remember"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Remember Me
              </label>
            </div>
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
              <h2 className="text-xl">Login</h2>
            </div>
            <FormAlert error={loginHook.error} />
            {emailNode}
            {passwordNode}
            {rememberNode}
            <div className="my-4">
              <Button type="submit" loading={loginHook.loading}>
                Login
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
