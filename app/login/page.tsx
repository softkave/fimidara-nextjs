"use client";

import styles from "@/components/utils/form/form.module.css";
import FormError from "@/components/utils/form/FormError.tsx";
import { FormAlert } from "@/components/utils/FormAlert.tsx";
import { appWorkspacePaths } from "@/lib/definitions/system.ts";
import { userConstants } from "@/lib/definitions/user.ts";
import { useUserLoginMutationHook } from "@/lib/hooks/mutationHooks.ts";
import useFormHelpers from "@/lib/hooks/useFormHelpers.ts";
import UserSessionStorageFns from "@/lib/storage/userSession.ts";
import { css } from "@emotion/css";
import { Button, Checkbox, Form, Input } from "antd";
import Title from "antd/es/typography/Title";
import { useRouter } from "next/navigation";
import * as yup from "yup";

export interface ILoginFormValues {
  email: string;
  password: string;
  remember: boolean;
}

export interface ILoginProps {}

const validationSchema = yup.object().shape({
  email: yup.string().email().required(),
  password: yup.string().max(userConstants.maxPasswordLength).required(),
});

const initialValues: ILoginFormValues = {
  email: "",
  password: "",
  remember: false,
};

export default function Login(props: ILoginProps) {
  const router = useRouter();
  const loginHook = useUserLoginMutationHook({
    onSuccess(data, params) {
      router.push(appWorkspacePaths.workspaces);
    },
  });
  const { formik } = useFormHelpers({
    errors: loginHook.error,
    formikProps: {
      validationSchema,
      initialValues,
      onSubmit: async (body) => {
        const result = await loginHook.runAsync({
          body: {
            email: body.email,
            password: body.password,
          },
        });

        if (body.remember) {
          UserSessionStorageFns.saveUserToken(result.body.token);
          UserSessionStorageFns.saveClientAssignedToken(
            result.body.clientAssignedToken
          );
        }
      },
    },
  });

  const emailNode = (
    <Form.Item
      required
      label="Email Address"
      help={
        formik.touched.email && (
          <FormError visible={formik.touched.email}>
            {formik.errors.email}
          </FormError>
        )
      }
      labelCol={{ span: 24 }}
      wrapperCol={{ span: 24 }}
    >
      <Input
        autoComplete="email"
        name="email"
        onBlur={formik.handleBlur}
        onChange={formik.handleChange}
        value={formik.values.email}
        disabled={loginHook.loading}
        placeholder="Enter your email address"
      />
    </Form.Item>
  );

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
        autoComplete="current-password"
        name="password"
        onBlur={formik.handleBlur}
        onChange={formik.handleChange}
        value={formik.values.password}
        disabled={loginHook.loading}
        placeholder="Enter your password"
        maxLength={userConstants.maxPasswordLength}
      />
    </Form.Item>
  );

  const rememberNode = (
    <Form.Item>
      <Checkbox
        name="remember"
        onChange={(evt) => {
          formik.setFieldValue("remember", evt.target.checked);
        }}
        checked={formik.values.remember}
        disabled={loginHook.loading}
      >
        Remember Me
      </Checkbox>
    </Form.Item>
  );

  return (
    <div className={styles.formBody}>
      <div className={styles.formContentWrapper}>
        <form onSubmit={formik.handleSubmit}>
          <Form.Item>
            <Title level={4}>Login</Title>
          </Form.Item>
          <FormAlert error={loginHook.error} />
          {emailNode}
          {passwordNode}
          {rememberNode}
          <Form.Item className={css({ marginTop: "16px" })}>
            <Button
              block
              type="primary"
              htmlType="submit"
              loading={loginHook.loading}
            >
              {loginHook.loading ? "Logging In" : "Log In"}
            </Button>
          </Form.Item>
        </form>
      </div>
    </div>
  );
}
