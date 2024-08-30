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
import { SignupEndpointParams } from "@/lib/api/privateTypes.ts";
import { appWorkspacePaths } from "@/lib/definitions/system.ts";
import { userConstants } from "@/lib/definitions/user.ts";
import { useUserSignupMutationHook } from "@/lib/hooks/mutationHooks.ts";
import { useNewForm } from "@/lib/hooks/useFormHelpers.ts";
import { messages } from "@/lib/messages/messages.ts";
import { zodResolver } from "@hookform/resolvers/zod";
import Text from "antd/es/typography/Text";
import Title from "antd/es/typography/Title";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

interface ISignupFormValues extends Required<SignupEndpointParams> {
  // confirmEmail: string;
  // confirmPassword: string;
}

export interface ISignupProps {}

const formSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  password: z.string().max(userConstants.maxPasswordLength),
});

export default function Signup(props: ISignupProps) {
  const router = useRouter();
  const signupHook = useUserSignupMutationHook({
    onSuccess(data, params) {
      router.push(appWorkspacePaths.workspaces);
    },
  });
  const onSubmit = (body: z.infer<typeof formSchema>) =>
    signupHook.runAsync({ body });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    },
  });
  useNewForm(form, { errors: signupHook.error });

  const firstNameNode = (
    <FormField
      control={form.control}
      name="firstName"
      render={({ field }) => (
        <FormItem>
          <FormLabel>First Name</FormLabel>
          <FormControl>
            <Input
              {...field}
              autoComplete="given-name"
              name="firstName"
              placeholder="Enter your first name"
              maxLength={userConstants.maxNameLength}
            />
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
          <FormLabel>Last Name</FormLabel>
          <FormControl>
            <Input
              {...field}
              autoComplete="family-name"
              name="lastName"
              placeholder="Enter your last name"
              maxLength={userConstants.maxNameLength}
            />
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
          <FormLabel>Email Address</FormLabel>
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
          <FormLabel>Password</FormLabel>
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
      <Text type="secondary">{messages.signupEmailConsent}</Text>
    </div>
  );

  return (
    <div className={styles.formBody}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="mb-4">
            <Title level={4}>Signup</Title>
          </div>
          <FormAlert error={signupHook.error} />
          {firstNameNode}
          {lastNameNode}
          {emailNode}
          {passwordNode}
          {consentNode}
          <div className="my-4">
            <Button type="submit" loading={signupHook.loading}>
              {signupHook.loading ? "Creating Account" : "Create Account"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
