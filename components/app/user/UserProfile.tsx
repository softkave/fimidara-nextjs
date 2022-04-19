import { css } from "@emotion/css";
import { Button, Form, Input, message } from "antd";
import * as yup from "yup";
import React from "react";
import { useRequest } from "ahooks";
import {
  formBodyClassName,
  formContentWrapperClassName,
} from "../../../components/form/classNames";
import FormError from "../../../components/form/FormError";
import {
  EmailAddressNotAvailableError,
  IUser,
  IUserProfileInput,
  userConstants,
} from "../../../lib/definitions/user";
import { messages } from "../../../lib/messages/messages";
import { preSubmitCheck } from "../../../components/form/formUtils";
import { signupValidationParts } from "../../../lib/validation/user";
import useFormHelpers from "../../../lib/hooks/useFormHelpers";
import UserEndpoint from "../../../lib/api/endpoints/user";
import { checkEndpointResult } from "../../../lib/api/utils";
import { flattenErrorList } from "../../../lib/utilities/utils";
import useUser from "../../../lib/hooks/useUser";
import PageLoading from "../../utils/PageLoading";
import PageError from "../../utils/PageError";
import { getBaseError, toAppErrorsArray } from "../../../lib/utilities/errors";
import { FormAlert } from "../../utils/FormAlert";

export interface IUserProfileProps {}

const userSettingsValidation = yup.object().shape({
  firstName: signupValidationParts.name.required(messages.firstNameRequired),
  lastName: signupValidationParts.name.required(messages.lastNameRequired),
  email: signupValidationParts.email.required(messages.emailRequired),
});

function getInitialValues(user?: IUser): IUserProfileInput {
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
  const { isLoading, error, data, mutate } = useUser();
  const onSubmit = React.useCallback(
    async (data: IUserProfileInput) => {
      try {
        const result = await UserEndpoint.updateUser(data);
        checkEndpointResult(result);
        mutate(result, false);
        message.success("Profile updated");
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
    },
    [mutate]
  );

  const submitResult = useRequest(onSubmit, { manual: true });
  const { formik } = useFormHelpers({
    errors: submitResult.error,
    formikProps: {
      validationSchema: userSettingsValidation,

      // Will be replaced in a useEffect when user loads
      initialValues: getInitialValues(),
      onSubmit: submitResult.run,
    },
  });

  const setValues = formik.setValues;
  React.useEffect(() => {
    if (data?.user) {
      setValues(getInitialValues(data.user));
    }
  }, [data?.user, setValues]);

  if (error) {
    return (
      <PageError messageText={getBaseError(error) || "Error fetching user"} />
    );
  } else if (isLoading) {
    return <PageLoading messageText="Loading user..." />;
  }

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

  return (
    <div className={formBodyClassName}>
      <div className={formContentWrapperClassName}>
        <form onSubmit={formik.handleSubmit}>
          <FormAlert error={submitResult.error} />
          {firstNameNode}
          {lastNameNode}
          {emailNode}
          <Form.Item className={css({ marginTop: "16px" })}>
            <Button
              block
              type="primary"
              htmlType="submit"
              loading={submitResult.loading}
              onClick={() => preSubmitCheck(formik)}
            >
              {submitResult.loading ? "Updating Profile" : "Update Profile"}
            </Button>
          </Form.Item>
        </form>
      </div>
    </div>
  );
}
