"use client";

import styles from "@/components/utils/form/form.module.css";
import FormError from "@/components/utils/form/FormError";
import { preSubmitCheck } from "@/components/utils/form/formUtils";
import { userConstants } from "@/lib/definitions/user";
import { useUserUpdateMutationHook } from "@/lib/hooks/mutationHooks";
import useFormHelpers from "@/lib/hooks/useFormHelpers";
import { messages } from "@/lib/messages/messages";
import { signupValidationParts } from "@/lib/validation/user";
import { css } from "@emotion/css";
import { Button, Form, Input, message } from "antd";
import { LoginResult, User } from "fimidara";
import * as yup from "yup";
import { FormAlert } from "../../utils/FormAlert";

export interface IUserProfileProps {
  session: LoginResult;
}

interface UserProfileFormValues {
  firstName: string;
  lastName: string;
  email: string;
}

const userSettingsValidation = yup.object().shape({
  firstName: signupValidationParts.name.required(messages.firstNameRequired),
  lastName: signupValidationParts.name.required(messages.lastNameRequired),
  email: signupValidationParts.email.required(messages.emailRequired),
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
  const updateUserHook = useUserUpdateMutationHook({
    onSuccess(data, params) {
      message.success("Profile updated");
    },
  });
  const { formik } = useFormHelpers({
    errors: updateUserHook.error,
    formikProps: {
      validationSchema: userSettingsValidation,
      initialValues: getInitialValues(session.user),
      onSubmit: (body) => updateUserHook.runAsync({ body }),
    },
  });

  const firstNameNode = (
    <Form.Item
      required
      label="First Name"
      help={
        formik.touched?.firstName &&
        formik.errors?.firstName && (
          <FormError
            visible={formik.touched.firstName}
            error={formik.errors.firstName}
          />
        )
      }
      labelCol={{ span: 24 }}
      wrapperCol={{ span: 24 }}
    >
      <Input
        autoComplete="given-name"
        name="firstName"
        value={formik.values.firstName}
        onBlur={formik.handleBlur}
        onChange={formik.handleChange}
        placeholder="Enter your first name"
        disabled={updateUserHook.loading}
        maxLength={userConstants.maxNameLength}
      />
    </Form.Item>
  );

  const lastNameNode = (
    <Form.Item
      required
      label="Last Name"
      help={
        formik.touched?.lastName &&
        formik.errors?.lastName && (
          <FormError
            visible={formik.touched.lastName}
            error={formik.errors.lastName}
          />
        )
      }
      labelCol={{ span: 24 }}
      wrapperCol={{ span: 24 }}
    >
      <Input
        autoComplete="family-name"
        name="lastName"
        value={formik.values.lastName}
        onBlur={formik.handleBlur}
        onChange={formik.handleChange}
        placeholder="Enter your last name"
        disabled={updateUserHook.loading}
        maxLength={userConstants.maxNameLength}
      />
    </Form.Item>
  );

  const emailNode = (
    <Form.Item
      required
      label="Email Address"
      help={
        formik.touched?.email &&
        formik.errors?.email && (
          <FormError
            visible={formik.touched.email}
            error={formik.errors.email}
          />
        )
      }
      labelCol={{ span: 24 }}
      wrapperCol={{ span: 24 }}
    >
      <Input
        autoComplete="email"
        name="email"
        value={formik.values.email}
        onBlur={formik.handleBlur}
        onChange={formik.handleChange}
        disabled={updateUserHook.loading}
        placeholder="Enter your email address"
      />
    </Form.Item>
  );

  return (
    <div className={styles.formBody}>
      <div className={styles.formContentWrapper}>
        <form onSubmit={formik.handleSubmit}>
          <FormAlert error={updateUserHook.error} />
          {firstNameNode}
          {lastNameNode}
          {emailNode}
          <Form.Item className={css({ marginTop: "16px" })}>
            <Button
              block
              type="primary"
              htmlType="submit"
              loading={updateUserHook.loading}
              onClick={() => preSubmitCheck(formik)}
            >
              {updateUserHook.loading ? "Updating Profile" : "Update Profile"}
            </Button>
          </Form.Item>
        </form>
      </div>
    </div>
  );
}
