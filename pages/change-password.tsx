import { css } from "@emotion/css";
import { Button, Form, Input, notification, Typography } from "antd";
import { useRouter } from "next/router";
import * as yup from "yup";
import {
  formBodyClassName,
  formContentWrapperClassName,
} from "../components/form/classNames";
import FormError from "../components/form/FormError";
import { FormAlert } from "../components/utils/FormAlert";
import { appWorkspacePaths, systemConstants } from "../lib/definitions/system";
import { userConstants } from "../lib/definitions/user";
import { useUserChangePasswordWithTokenMutationHook } from "../lib/hooks/mutationHooks";
import useFormHelpers from "../lib/hooks/useFormHelpers";

export interface IChangePasswordWithTokenFormData {
  password: string;
}

interface IChangePasswordWithTokenFormInternalData
  extends IChangePasswordWithTokenFormData {
  // confirmPassword: string;
}

export interface IChangePasswordWithTokeneProps {}

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

const initialValues: IChangePasswordWithTokenFormInternalData = {
  password: "",
};

export default function ChangePasswordWithToken(
  props: IChangePasswordWithTokeneProps
) {
  const router = useRouter();
  const changePasswordHook = useUserChangePasswordWithTokenMutationHook({
    onSuccess(data, params) {
      router.push(appWorkspacePaths.workspaces);
    },
  });
  const { formik } = useFormHelpers({
    errors: changePasswordHook.error,
    formikProps: {
      validationSchema,
      initialValues: initialValues,
      onSubmit: (body) => {
        const query = new URLSearchParams(window.location.search);
        const token = query.get(systemConstants.tokenQueryKey);

        if (!token) {
          notification.error({
            message: "Change password token not found",
            description:
              "Please ensure you are using the change password link sent to your email address",
          });

          return;
        }

        return changePasswordHook.runAsync({ body, authToken: token });
      },
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
        disabled={changePasswordHook.loading}
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
          <FormAlert error={changePasswordHook.error} />
          {passwordNode}
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
