import React from "react";
import { css } from "@emotion/css";
import { Alert, Button, Form, Input, notification, Typography } from "antd";
import * as yup from "yup";
import { useRequest } from "ahooks";
import { formClasses } from "../../components/form/classNames";
import FormError from "../../components/form/FormError";
import { getFormError, preSubmitCheck } from "../../components/form/formUtils";
import useFormHelpers from "../../lib/hooks/useFormHelpers";
import UserEndpoint from "../../lib/api/endpoints/user";
import { toAppErrorsArray } from "../../lib/api/utils";
import { flattenErrorList } from "../../lib/utilities/utils";
import WebHeader from "../../components/web/WebHeader";

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
  const [successMessage, setSuccessMessage] = React.useState("");
  const onSubmit = React.useCallback(async (data: IForgotPasswordFormData) => {
    try {
      setSuccessMessage("");
      const result = await UserEndpoint.forgotPassword({
        email: data.email,
      });

      if (result.errors) {
        throw result.errors;
      }

      setSuccessMessage("Change password email sent");

      // notification.success({
      //   message: "Change password email sent",
      //   // description: "",
      // });
    } catch (error) {
      const errArray = toAppErrorsArray(error);
      const flattenedErrors = flattenErrorList(errArray);
      throw flattenedErrors;
    }
  }, []);

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
        disabled={submitResult.loading}
        placeholder="Enter your email address"
      />
    </Form.Item>
  );

  return (
    <div className={formClasses.formBodyClassName}>
      <WebHeader />
      <div className={formClasses.formContentWrapperClassName}>
        <form onSubmit={formik.handleSubmit}>
          <Form.Item>
            <Typography.Title level={4}>Forgot Password</Typography.Title>
          </Form.Item>
          {globalError && (
            <Form.Item>
              <Alert type="error" message={globalError} />
            </Form.Item>
          )}
          {successMessage && (
            <Form.Item>
              <Alert type="success" message={successMessage} />
            </Form.Item>
          )}
          {emailNode}
          <Form.Item className={css({ marginTop: "16px" })}>
            <Button
              block
              type="primary"
              htmlType="submit"
              loading={submitResult.loading}
              onClick={() => preSubmitCheck(formik)}
            >
              {submitResult.loading
                ? "Sending Change Password Email"
                : "Send Change Password Email"}
            </Button>
          </Form.Item>
        </form>
      </div>
    </div>
  );
}
