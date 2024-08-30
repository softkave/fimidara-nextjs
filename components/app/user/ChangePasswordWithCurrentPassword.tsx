"use client";

import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import FormError from "@/components/utils/form/FormError.tsx";
import styles from "@/components/utils/form/form.module.css";
import { userConstants } from "@/lib/definitions/user";
import { useUserChangePasswordWithCurrentPasswordMutationHook } from "@/lib/hooks/mutationHooks";
import useFormHelpers from "@/lib/hooks/useFormHelpers";
import { css } from "@emotion/css";
import { Form, message } from "antd";
import * as yup from "yup";
import { FormAlert } from "../../utils/FormAlert";

const validationSchema = yup.object().shape({
  password: yup
    .string()
    .min(userConstants.minPasswordLength)
    .max(userConstants.maxPasswordLength)
    .required(),
  currentPassword: yup.string().required(),
});

export default function ChangePasswordWithCurrentPassword() {
  const changePasswordHook =
    useUserChangePasswordWithCurrentPasswordMutationHook({
      onSuccess(data, params) {
        message.success(`Password changed`);
      },
    });
  const { formik } = useFormHelpers({
    errors: changePasswordHook.error,
    formikProps: {
      validationSchema,
      initialValues: { password: "", currentPassword: "" },
      onSubmit: (body) => changePasswordHook.runAsync({ body }),
    },
  });

  const newPasswordNode = (
    <Form.Item
      required
      label="New Password"
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
      <Input
        type="password"
        autoComplete="new-password"
        name="password"
        onBlur={formik.handleBlur}
        onChange={formik.handleChange}
        value={formik.values.password}
        placeholder="Enter new password"
        disabled={changePasswordHook.loading}
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
      <Input
        type="password"
        autoComplete="current-password"
        name="password"
        onBlur={formik.handleBlur}
        onChange={formik.handleChange}
        value={formik.values.currentPassword}
        placeholder="Enter current password"
        disabled={changePasswordHook.loading}
        maxLength={userConstants.maxPasswordLength}
      />
    </Form.Item>
  );

  return (
    <div className={styles.formBody}>
      <div className={styles.formContentWrapper}>
        <form onSubmit={formik.handleSubmit}>
          <FormAlert error={changePasswordHook.error} />
          {currentPasswordNode}
          {newPasswordNode}
          <Form.Item className={css({ marginTop: "16px" })}>
            <Button type="submit" loading={changePasswordHook.loading}>
              {changePasswordHook.loading
                ? "Changing Password"
                : "Change Password"}
            </Button>
          </Form.Item>
        </form>
      </div>
    </div>
  );
}
