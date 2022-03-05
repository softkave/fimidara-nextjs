import { css } from "@emotion/css";
import { Alert, Button, Form, Input, notification, Typography } from "antd";
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
import { userConstants } from "../../lib/definitions/user";
import { getFormError } from "../../components/form/formUtils";
import useFormHelpers from "../../lib/hooks/useFormHelpers";
import UserEndpoint from "../../lib/api/endpoints/user";
import UserSessionStorageFns from "../../lib/storage/userSession";
import SessionActions from "../../lib/store/session/actions";
import { appOrgPaths, systemConstants } from "../../lib/definitions/system";
import { checkEndpointResult, toAppErrorsArray } from "../../lib/api/utils";
import { flattenErrorList } from "../../lib/utilities/utils";
import Head from "next/head";
import getAppFonts from "../../components/utils/appFonts";
import WebHeader from "../../components/web/WebHeader";

export interface IChangePasswordFormData {
  password: string;
}

interface IChangePasswordFormInternalData extends IChangePasswordFormData {
  // confirmPassword: string;
}

export interface IChangePasswordProps {}

const validationSchema = yup.object().shape({
  password: yup
    .string()
    .min(userConstants.minPasswordLength)
    .max(userConstants.maxPasswordLength)
    .required(),
  // confirmPassword: yup
  //   .string()
  //   .oneOf([yup.ref("password")], messages.passwordsDoNotMatch)
  //   .required(),
});

const initialValues: IChangePasswordFormInternalData = {
  password: "",
};

export default function ChangePassword(props: IChangePasswordProps) {
  const dispatch = useDispatch();
  const router = useRouter();
  const onSubmit = React.useCallback(
    async (data: IChangePasswordFormInternalData) => {
      try {
        const query = new URLSearchParams(window.location.search);
        const token = query.get(systemConstants.tokenQueryKey);

        if (!token) {
          notification.error({
            message: "Change password token not found",
            description:
              "Please ensure you are using the change password link sent to your email address.",
          });

          return;
        }

        const result = await UserEndpoint.changePasswordWithToken({
          token,
          password: data.password,
        });

        checkEndpointResult(result);
        UserSessionStorageFns.saveUserToken(result.token);
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
        throw flattenedErrors;
      }
    },
    []
  );

  const submitResult = useRequest(onSubmit, { manual: true });
  const { formik } = useFormHelpers({
    errors: submitResult.error,
    formikProps: {
      validationSchema,
      initialValues: initialValues,
      onSubmit: submitResult.run,
    },
  });

  const globalError = getFormError(formik.errors);

  const passwordNode = (
    <Form.Item
      required
      label="Password"
      help={
        formik.touched.password && (
          <FormError visible={formik.touched.password}>
            {formik.errors.password}
          </FormError>
        )
      }
      labelCol={{ span: 24 }}
      wrapperCol={{ span: 24 }}
    >
      <Input.Password
        visibilityToggle
        autoComplete="new-password"
        name="password"
        onBlur={formik.handleBlur}
        onChange={formik.handleChange}
        value={formik.values.password}
        placeholder="Enter new password"
        disabled={submitResult.loading}
        maxLength={userConstants.maxPasswordLength}
      />
    </Form.Item>
  );

  return (
    <div className={formBodyClassName}>
      <Head>{getAppFonts()}</Head>
      <WebHeader />
      <div className={formContentWrapperClassName}>
        <form onSubmit={formik.handleSubmit}>
          <Typography.Title level={4}>Change Password</Typography.Title>
          {globalError && (
            <Form.Item>
              <Alert type="error" message={globalError} />
            </Form.Item>
          )}
          {passwordNode}
          <Form.Item className={css({ marginTop: "16px" })}>
            <Button
              block
              type="primary"
              htmlType="submit"
              loading={submitResult.loading}
            >
              {submitResult.loading ? "Changing Password" : "Change Password"}
            </Button>
          </Form.Item>
        </form>
      </div>
    </div>
  );
}
