"use client";

import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import styles from "@/components/utils/form/form.module.css";
import FormError from "@/components/utils/form/FormError.tsx";
import { preSubmitCheck } from "@/components/utils/form/formUtils";
import { FormAlert } from "@/components/utils/FormAlert.tsx";
import { appComponentConstants } from "@/components/utils/utils.ts";
import { useUserForgotPasswordMutationHook } from "@/lib/hooks/mutationHooks.ts";
import useFormHelpers from "@/lib/hooks/useFormHelpers.ts";
import { css } from "@emotion/css";
import { Form, notification } from "antd";
import Title from "antd/es/typography/Title";
import * as yup from "yup";

export interface IForgotPasswordFormData {
  email: string;
}

interface IForgotPasswordFormInternalData extends IForgotPasswordFormData {
  // confirmEmail: string;
}

export interface IForgotPasswordProps {}

const validationSchema = yup.object().shape({
  email: yup.string().email().required(),
});

const initialValues: IForgotPasswordFormInternalData = {
  email: "",
  // confirmEmail: "",
};

export default function ForgotPassword(props: IForgotPasswordProps) {
  const forgotHook = useUserForgotPasswordMutationHook({
    onSuccess(data, params) {
      notification.success({
        type: "success",
        message: `You should see a change password email soon at ${params[0].body.email}`,
        duration: appComponentConstants.messageDuration,
      });
    },
  });
  const { formik } = useFormHelpers({
    errors: forgotHook.error,
    formikProps: {
      validationSchema,
      initialValues,
      onSubmit: (body) => forgotHook.runAsync({ body }),
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
        disabled={forgotHook.loading}
        placeholder="Enter your email address"
      />
    </Form.Item>
  );

  return (
    <div className={styles.formBody}>
      <div className={styles.formContentWrapper}>
        <form onSubmit={formik.handleSubmit}>
          <Form.Item>
            <Title level={4}>Request Change Password</Title>
          </Form.Item>
          <FormAlert error={forgotHook.error} />
          {emailNode}
          <Form.Item className={css({ marginTop: "16px" })}>
            <Button
              type="submit"
              loading={forgotHook.loading}
              onClick={() => preSubmitCheck(formik)}
            >
              {forgotHook.loading
                ? "Sending Change Password Email"
                : "Send Change Password Email"}
            </Button>
          </Form.Item>
        </form>
      </div>
    </div>
  );
}
