import { css } from "@emotion/css";
import { Button, Form, Input, Typography } from "antd";
import { useRouter } from "next/router";
import * as yup from "yup";
import FormError from "../components/form/FormError";
import {
  formBodyClassName,
  formContentWrapperClassName,
} from "../components/form/classNames";
import { FormAlert } from "../components/utils/FormAlert";
import { SignupEndpointParams } from "../lib/api/privateTypes";
import { appWorkspacePaths } from "../lib/definitions/system";
import { userConstants } from "../lib/definitions/user";
import { useUserSignupMutationHook } from "../lib/hooks/mutationHooks";
import useFormHelpers from "../lib/hooks/useFormHelpers";
import { messages } from "../lib/messages/messages";
import { signupValidationParts } from "../lib/validation/user";

interface ISignupFormValues extends Required<SignupEndpointParams> {
  // confirmEmail: string;
  // confirmPassword: string;
}

export interface ISignupProps {}

const signupValidation = yup.object().shape({
  firstName: signupValidationParts.name.required(messages.firstNameRequired),
  lastName: signupValidationParts.name.required(messages.lastNameRequired),
  email: signupValidationParts.email.required(messages.emailRequired),
  // confirmEmail: signupValidationParts.confirmEmail.required(),
  password: signupValidationParts.password.required(messages.passwordRequired),
  // confirmPassword: signupValidationParts.confirmPassword.required(),
});

const initialValues: ISignupFormValues = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  // confirmEmail: "",
  // confirmPassword: "",
};

export default function Signup(props: ISignupProps) {
  const router = useRouter();
  const signupHook = useUserSignupMutationHook({
    onSuccess(data, params) {
      router.push(appWorkspacePaths.workspaces);
    },
  });

  const { formik } = useFormHelpers({
    errors: signupHook.error,
    formikProps: {
      validationSchema: signupValidation,
      initialValues: initialValues,
      onSubmit: (body) => signupHook.runAsync({ body }),
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
        disabled={signupHook.loading}
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
        disabled={signupHook.loading}
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
        disabled={signupHook.loading}
        placeholder="Enter your email address"
      />
    </Form.Item>
  );

  const passwordNode = (
    <Form.Item
      required
      label="Password"
      help={
        formik.touched?.password && formik.errors?.password ? (
          <FormError
            visible={formik.touched.password}
            error={formik.errors?.password}
          />
        ) : (
          messages.passwordMinChars
        )
      }
      labelCol={{ span: 24 }}
      wrapperCol={{ span: 24 }}
    >
      <Input.Password
        visibilityToggle
        autoComplete="new-password"
        name="password"
        value={formik.values.password}
        onBlur={formik.handleBlur}
        onChange={formik.handleChange}
        disabled={signupHook.loading}
        placeholder="Enter new password"
        maxLength={userConstants.maxPasswordLength}
      />
    </Form.Item>
  );

  const consentNode = (
    <Form.Item
      className={css({
        marginTop: "16px",
      })}
    >
      <Typography.Text type="secondary">
        {messages.signupEmailConsent}
      </Typography.Text>
    </Form.Item>
  );

  return (
    <div className={formBodyClassName}>
      <form
        onSubmit={formik.handleSubmit}
        className={formContentWrapperClassName}
      >
        <Form.Item>
          <Typography.Title level={4}>Signup</Typography.Title>
        </Form.Item>
        <FormAlert error={signupHook.error} />
        {firstNameNode}
        {lastNameNode}
        {emailNode}
        {passwordNode}
        {consentNode}
        <Form.Item className={css({ marginTop: "16px" })}>
          <Button
            block
            type="primary"
            htmlType="submit"
            loading={signupHook.loading}
          >
            {signupHook.loading ? "Creating Account" : "Create Account"}
          </Button>
        </Form.Item>
      </form>
    </div>
  );
}
