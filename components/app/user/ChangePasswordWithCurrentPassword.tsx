import { userConstants } from "@/lib/definitions/user";
import { useUserChangePasswordWithCurrentPasswordMutationHook } from "@/lib/hooks/mutationHooks";
import useFormHelpers from "@/lib/hooks/useFormHelpers";
import { css } from "@emotion/css";
import { Button, Form, Input, message } from "antd";
import * as yup from "yup";
import FormError from "../../form/FormError";
import { formClasses } from "../../form/classNames";
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
      <Input.Password
        visibilityToggle
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
      <Input.Password
        visibilityToggle
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
    <div className={formClasses.formBodyClassName}>
      <div className={formClasses.formContentWrapperClassName}>
        <form onSubmit={formik.handleSubmit}>
          <FormAlert error={changePasswordHook.error} />
          {currentPasswordNode}
          {newPasswordNode}
          <Form.Item className={css({ marginTop: "16px" })}>
            <Button
              block
              type="primary"
              htmlType="submit"
              loading={changePasswordHook.loading}
            >
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
