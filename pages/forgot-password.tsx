import { css } from "@emotion/css";
import { Button, Form, Input, Typography, notification } from "antd";
import * as yup from "yup";
import FormError from "../components/form/FormError";
import { formClasses } from "../components/form/classNames";
import { preSubmitCheck } from "../components/form/formUtils";
import { FormAlert } from "../components/utils/FormAlert";
import { appComponentConstants } from "../components/utils/utils";
import { useUserForgotPasswordMutationHook } from "../lib/hooks/mutationHooks";
import useFormHelpers from "../lib/hooks/useFormHelpers";

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
    <div className={formClasses.formBodyClassName}>
      <div className={formClasses.formContentWrapperClassName}>
        <form onSubmit={formik.handleSubmit}>
          <Form.Item>
            <Typography.Title level={4}>
              Request Change Password
            </Typography.Title>
          </Form.Item>
          <FormAlert error={forgotHook.error} />
          {emailNode}
          <Form.Item className={css({ marginTop: "16px" })}>
            <Button
              block
              type="primary"
              htmlType="submit"
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
