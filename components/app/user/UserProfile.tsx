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
import styles from "@/components/utils/form/form.module.css";
import { useToast } from "@/hooks/use-toast.ts";
import {
  LoginResult,
  User,
} from "@/lib/api-internal/endpoints/privateTypes.ts";
import { userConstants } from "@/lib/definitions/user";
import { useUserUpdateMutationHook } from "@/lib/hooks/mutationHooks";
import { useFormHelpers } from "@/lib/hooks/useFormHelpers.ts";
import { signupValidationParts } from "@/lib/validation/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { FormAlert } from "../../utils/FormAlert";

export interface IUserProfileProps {
  session: LoginResult;
}

interface UserProfileFormValues {
  firstName: string;
  lastName: string;
  email: string;
}

const userSettingsValidation = z.object({
  firstName: signupValidationParts.firstName,
  lastName: signupValidationParts.lastName,
  email: signupValidationParts.email,
});

function getInitialValues(user?: User): UserProfileFormValues {
  if (!user) {
    return {
      firstName: "",
      lastName: "",
      email: "",
    };
  }

  return {
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
  };
}

export default function UserProfile(props: IUserProfileProps) {
  const { session } = props;
  const { toast } = useToast();
  const updateUserHook = useUserUpdateMutationHook({
    onSuccess(data, params) {
      toast({ description: "Profile updated" });
    },
  });

  const onSubmit = (body: z.infer<typeof userSettingsValidation>) =>
    updateUserHook.runAsync(body);

  const form = useForm<z.infer<typeof userSettingsValidation>>({
    resolver: zodResolver(userSettingsValidation),
    defaultValues: getInitialValues(session.user),
  });

  useFormHelpers(form, { errors: updateUserHook.error });

  const firstNameNode = (
    <FormField
      control={form.control}
      name="firstName"
      render={({ field }) => (
        <FormItem>
          <FormLabel required>First Name</FormLabel>
          <FormControl>
            <Input
              {...field}
              maxLength={userConstants.maxNameLength}
              autoComplete="given-name"
              placeholder="Enter your first name"
            />
            <InputCounter
              count={field.value.length}
              maxCount={userConstants.maxNameLength}
              onTruncate={() => {
                form.setValue(
                  "firstName",
                  field.value.slice(0, userConstants.maxNameLength)
                );
              }}
              className="mt-1"
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
          <FormLabel required>Last Name</FormLabel>
          <FormControl>
            <Input
              {...field}
              autoComplete="family-name"
              placeholder="Enter your last name"
              maxLength={userConstants.maxNameLength}
            />
            <InputCounter
              count={field.value.length}
              maxCount={userConstants.maxNameLength}
              onTruncate={() => {
                form.setValue(
                  "lastName",
                  field.value.slice(0, userConstants.maxNameLength)
                );
              }}
              className="mt-1"
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
            <FormAlert error={updateUserHook.error} />
            {firstNameNode}
            {lastNameNode}
            {emailNode}
            <div className="my-4">
              <Button type="submit" loading={updateUserHook.loading}>
                Update Profile
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
