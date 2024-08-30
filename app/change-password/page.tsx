"use client";

import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import styles from "@/components/utils/form/form.module.css";
import FormError from "@/components/utils/form/FormError.tsx";
import { FormAlert } from "@/components/utils/FormAlert.tsx";
import {
  appWorkspacePaths,
  systemConstants,
} from "@/lib/definitions/system.ts";
import { userConstants } from "@/lib/definitions/user.ts";
import { useUserChangePasswordWithTokenMutationHook } from "@/lib/hooks/mutationHooks.ts";
import useFormHelpers from "@/lib/hooks/useFormHelpers.ts";
import { css } from "@emotion/css";
import { Form, notification } from "antd";
import Title from "antd/es/typography/Title";
import { useRouter } from "next/navigation";
import * as yup from "yup";

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

  return (
    <div className={styles.formBody}>
      <div className={styles.formContentWrapper}>
        <form onSubmit={formik.handleSubmit}>
          <Form.Item>
            <Title level={4}>Change Password</Title>
          </Form.Item>
          <FormAlert error={changePasswordHook.error} />
          {passwordNode}
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
