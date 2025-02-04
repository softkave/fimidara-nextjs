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
import { InputCounter } from "@/components/ui/input-counter.tsx";
import { Input } from "@/components/ui/input.tsx";
import { cn } from "@/components/utils.ts";
import styles from "@/components/utils/form/form.module.css";
import { FormAlert } from "@/components/utils/FormAlert.tsx";
import { SignupEndpointParams } from "@/lib/api-internal/endpoints/privateTypes.ts";
import { kAppWorkspacePaths } from "@/lib/definitions/paths/workspace.ts";
import { userConstants } from "@/lib/definitions/user.ts";
import { useUserSignupMutationHook } from "@/lib/hooks/mutationHooks.ts";
import { useFormHelpers } from "@/lib/hooks/useFormHelpers.ts";
import { messages } from "@/lib/messages/messages.ts";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

interface ISignupFormValues extends Required<SignupEndpointParams> {
  // confirmEmail: string;
  // confirmPassword: string;
}

export interface ISignupProps {}

const formSchema = z.object({
  firstName: z.string({ required_error: "first name is required" }).min(1),
  lastName: z.string({ required_error: "last name is required" }).min(1),
  email: z.string().email(),
  password: z.string().min(1).max(userConstants.maxPasswordLength),
});

export default function Signup(props: ISignupProps) {
  const router = useRouter();
  const signupHook = useUserSignupMutationHook({
    onSuccess(data, params) {
      router.push(kAppWorkspacePaths.workspaces);
    },
  });
  const onSubmit = (body: z.infer<typeof formSchema>) =>
    signupHook.runAsync(body);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    },
  });
  useFormHelpers(form, { errors: signupHook.error });

  const firstNameNode = (
    <FormField
      control={form.control}
      name="firstName"
      render={({ field }) => (
        <FormItem>
          <FormLabel required>First Name</FormLabel>
          <FormControl>
            <div>
              <Input
                {...field}
                autoComplete="given-name"
                name="firstName"
                placeholder="Enter your first name"
                maxLength={userConstants.maxNameLength}
              />
              <InputCounter
                count={field.value?.length ?? 0}
                maxCount={userConstants.maxNameLength}
                onTruncate={() => {
                  form.setValue(
                    "firstName",
                    field.value?.slice(0, userConstants.maxNameLength)
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

  const lastNameNode = (
    <FormField
      control={form.control}
      name="lastName"
      render={({ field }) => (
        <FormItem>
          <FormLabel required>Last Name</FormLabel>
          <FormControl>
            <div>
              <Input
                {...field}
                autoComplete="family-name"
                name="lastName"
                placeholder="Enter your last name"
                maxLength={userConstants.maxNameLength}
              />
              <InputCounter
                count={field.value?.length ?? 0}
                maxCount={userConstants.maxNameLength}
                onTruncate={() => {
                  form.setValue(
                    "lastName",
                    field.value?.slice(0, userConstants.maxNameLength)
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

  const consentNode = (
    <div className="my-4">
      <span className="text-secondary">{messages.signupEmailConsent}</span>
    </div>
  );

  return (
    <div className={styles.formBody}>
      <div className={cn(styles.formContentWrapper, "p-4")}>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="mb-4">
              <h2 className="text-xl">Signup</h2>
            </div>
            <FormAlert error={signupHook.error} />
            {firstNameNode}
            {lastNameNode}
            {emailNode}
            {passwordNode}
            {consentNode}
            <div className="my-4">
              <Button type="submit" loading={signupHook.loading}>
                Create Account
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
