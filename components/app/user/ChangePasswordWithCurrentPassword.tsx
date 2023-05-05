import { getPrivateFimidaraEndpointsUsingUserToken } from "@/lib/api/fimidaraEndpoints";
import { userConstants } from "@/lib/definitions/user";
import useFormHelpers from "@/lib/hooks/useFormHelpers";
import UserSessionStorageFns from "@/lib/storage/userSession";
import SessionActions from "@/lib/store/session/actions";
import { css } from "@emotion/css";
import { useRequest } from "ahooks";
import { Button, Form, Input } from "antd";
import React from "react";
import { useDispatch } from "react-redux";
import * as yup from "yup";
import FormError from "../../form/FormError";
import { formClasses } from "../../form/classNames";
import { FormAlert } from "../../utils/FormAlert";

export interface IChangePasswordFormData {
  newPassword: string;
  currentPassword: string;
}

const validationSchema = yup.object().shape({
  newPassword: yup
    .string()
    .min(userConstants.minPasswordLength)
    .max(userConstants.maxPasswordLength)
    .required(),
  currentPassword: yup.string().required(),
});

export default function ChangePasswordWithCurrentPassword() {
  const dispatch = useDispatch();
  const onSubmit = React.useCallback(
    async (data: IChangePasswordFormData) => {
      const endpoints = getPrivateFimidaraEndpointsUsingUserToken();
      const result = await endpoints.users.changePasswordWithCurrentPassword({
        body: {
          password: data.newPassword,
          currentPassword: data.currentPassword,
        },
      });

      UserSessionStorageFns.saveUserToken(result.body.token);
      UserSessionStorageFns.saveClientAssignedToken(
        result.body.clientAssignedToken
      );
      dispatch(SessionActions.update({ data: { token: result.body.token } }));
    },
    [dispatch]
  );

  const submitResult = useRequest(onSubmit, { manual: true });
  const { formik } = useFormHelpers({
    errors: submitResult.error,
    formikProps: {
      validationSchema,
      initialValues: { password: undefined } as any,
      onSubmit: submitResult.run,
    },
  });

  const newPasswordNode = (
    <Form.Item
      required
      label="New Password"
      help={
        formik.touched.newPassword && (
          <FormError visible={formik.touched.newPassword}>
            {formik.errors.newPassword}
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
        value={formik.values.newPassword}
        placeholder="Enter new password"
        disabled={submitResult.loading}
        maxLength={userConstants.maxPasswordLength}
      />
    </Form.Item>
  );

  const currentPasswordNode = (
    <Form.Item
      required
      label="Current Password"
      help={
        formik.touched.currentPassword && (
          <FormError visible={formik.touched.currentPassword}>
            {formik.errors.currentPassword}
          </FormError>
        )
      }
      labelCol={{ span: 24 }}
      wrapperCol={{ span: 24 }}
    >
      <Input.Password
        visibilityToggle
        autoComplete="current-password"
        name="password"
        onBlur={formik.handleBlur}
        onChange={formik.handleChange}
        value={formik.values.currentPassword}
        placeholder="Enter current password"
        disabled={submitResult.loading}
        maxLength={userConstants.maxPasswordLength}
      />
    </Form.Item>
  );

  return (
    <div className={formClasses.formBodyClassName}>
      <div className={formClasses.formContentWrapperClassName}>
        <form onSubmit={formik.handleSubmit}>
          <FormAlert error={submitResult.error} />
          {newPasswordNode}
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
