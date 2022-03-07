import { css } from "@emotion/css";
import { Alert, Button, Form, Input, Typography } from "antd";
import * as yup from "yup";
import { useDispatch } from "react-redux";
import React from "react";
import { useRequest } from "ahooks";
import { useRouter } from "next/router";
import {
  formBodyClassName,
  formContentWrapperClassName,
} from "../../components/form/classNames";
import FormError from "../../components/form/FormError";
import {
  EmailAddressNotAvailableError,
  IUserInput,
  userConstants,
} from "../../lib/definitions/user";
import { messages } from "../../lib/messages/messages";
import { getFormError } from "../../components/form/formUtils";
import { signupValidationParts } from "../../lib/validation/user";
import useFormHelpers from "../../lib/hooks/useFormHelpers";
import UserEndpoint from "../../lib/api/endpoints/user";
import UserSessionStorageFns from "../../lib/storage/userSession";
import SessionActions from "../../lib/store/session/actions";
import { appOrgPaths } from "../../lib/definitions/system";
import { toAppErrorsArray } from "../../lib/api/utils";
import { flattenErrorList } from "../../lib/utilities/utils";
import WebHeader from "../../components/web/WebHeader";

interface ISignupFormInternalData extends Required<IUserInput> {
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

const initialValues: ISignupFormInternalData = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  // confirmEmail: "",
  // confirmPassword: "",
};

export default function Signup(props: ISignupProps) {
  const dispatch = useDispatch();
  const router = useRouter();
  const onSubmit = React.useCallback(async (data: ISignupFormInternalData) => {
    try {
      const result = await UserEndpoint.signup(data);

      if (result.errors) {
        throw result.errors;
      }

      UserSessionStorageFns.saveUserToken(result.token);
      UserSessionStorageFns.saveClientAssignedToken(result.clientAssignedToken);
      dispatch(
        SessionActions.loginUser({
          userToken: result.token,
          userId: result.user.resourceId,
          clientAssignedToken: result.clientAssignedToken,
        })
      );

      router.push(appOrgPaths.orgs);
    } catch (error) {
      const errArray = toAppErrorsArray(error);
      const flattenedErrors = flattenErrorList(errArray);
      const emailExistsErr = errArray.find((err) => {
        return err.name === EmailAddressNotAvailableError.name;
      });

      if (emailExistsErr) {
        flattenedErrors["email"] = [emailExistsErr.message];
      }

      throw flattenedErrors;
    }
  }, []);

  const submitResult = useRequest(onSubmit, { manual: true });
  const { formik } = useFormHelpers({
    errors: submitResult.error,
    formikProps: {
      validationSchema: signupValidation,
      initialValues: initialValues,
      onSubmit: submitResult.run,
    },
  });

  const globalError = getFormError(formik.errors);
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
        disabled={submitResult.loading}
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
        disabled={submitResult.loading}
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
        disabled={submitResult.loading}
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
        disabled={submitResult.loading}
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
      <WebHeader />
      <div className={formContentWrapperClassName}>
        <form onSubmit={formik.handleSubmit}>
          <Typography.Title level={4}>Signup</Typography.Title>
          {globalError && (
            <Form.Item>
              <Alert type="error" message={globalError} />
            </Form.Item>
          )}
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
              loading={submitResult.loading}
            >
              {submitResult.loading ? "Creating Account" : "Create Account"}
            </Button>
          </Form.Item>
        </form>
      </div>
    </div>
  );
}
