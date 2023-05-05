import { css } from "@emotion/css";
import { useRequest } from "ahooks";
import { Button, Form, Input, notification, Typography } from "antd";
import { useRouter } from "next/router";
import React from "react";
import { useDispatch } from "react-redux";
import * as yup from "yup";
import {
  formBodyClassName,
  formContentWrapperClassName,
} from "../components/form/classNames";
import FormError from "../components/form/FormError";
import { FormAlert } from "../components/utils/FormAlert";
import { getPrivateFimidaraEndpointsUsingUserToken } from "../lib/api/fimidaraEndpoints";
import { appWorkspacePaths, systemConstants } from "../lib/definitions/system";
import { userConstants } from "../lib/definitions/user";
import useFormHelpers from "../lib/hooks/useFormHelpers";
import UserSessionStorageFns from "../lib/storage/userSession";
import SessionActions from "../lib/store/session/actions";

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
      const endpoints = getPrivateFimidaraEndpointsUsingUserToken();
      const query = new URLSearchParams(window.location.search);
      const token = query.get(systemConstants.tokenQueryKey);

      if (!token) {
        notification.error({
          message: "Change password token not found.",
          description:
            "Please ensure you are using the change password link sent to your email address.",
        });

        return;
      }

      const result = await endpoints.users.changePasswordWithToken({
        authToken: token,
        body: { password: data.password },
      });

      UserSessionStorageFns.saveUserToken(result.body.token);
      UserSessionStorageFns.saveClientAssignedToken(
        result.body.clientAssignedToken
      );
      dispatch(
        SessionActions.loginUser({
          userToken: result.body.token,
          userId: result.body.user.resourceId,
          clientAssignedToken: result.body.clientAssignedToken,
        })
      );
      router.push(appWorkspacePaths.workspaces);
    },
    [dispatch, router]
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
      <div className={formContentWrapperClassName}>
        <form onSubmit={formik.handleSubmit}>
          <Form.Item>
            <Typography.Title level={4}>Change Password</Typography.Title>
          </Form.Item>
          <FormAlert error={submitResult.error} />
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
