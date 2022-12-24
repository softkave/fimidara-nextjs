import { css } from "@emotion/css";
import { useRequest } from "ahooks";
import { Button, Checkbox, Form, Input, Typography } from "antd";
import { useRouter } from "next/router";
import React from "react";
import { useDispatch } from "react-redux";
import * as yup from "yup";
import { formClasses } from "../../components/form/classNames";
import FormError from "../../components/form/FormError";
import { FormAlert } from "../../components/utils/FormAlert";
import WebHeader from "../../components/web/WebHeader";
import UserEndpoint from "../../lib/api/endpoints/user";
import { appWorkspacePaths } from "../../lib/definitions/system";
import { userConstants } from "../../lib/definitions/user";
import useFormHelpers from "../../lib/hooks/useFormHelpers";
import UserSessionStorageFns from "../../lib/storage/userSession";
import SessionActions from "../../lib/store/session/actions";
import { toAppErrorsArray } from "../../lib/utils/errors";
import { flattenErrorList } from "../../lib/utils/utils";

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
  const dispatch = useDispatch();
  const router = useRouter();
  const onSubmit = React.useCallback(
    async (data: ILoginFormValues) => {
      try {
        const result = await UserEndpoint.login({
          email: data.email,
          password: data.password,
        });

        if (result.errors) {
          throw result.errors;
        }

        if (data.remember) {
          UserSessionStorageFns.saveUserToken(result.token);
          UserSessionStorageFns.saveClientAssignedToken(
            result.clientAssignedToken
          );
        }

        dispatch(
          SessionActions.loginUser({
            userToken: result.token,
            userId: result.user.resourceId,
            clientAssignedToken: result.clientAssignedToken,
          })
        );

        router.push(appWorkspacePaths.workspaces);
      } catch (error) {
        const errArray = toAppErrorsArray(error);
        const flattenedErrors = flattenErrorList(errArray);
        throw flattenedErrors;
      }
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
        disabled={submitResult.loading}
        placeholder="Enter your password"
        maxLength={userConstants.maxPasswordLength}
      />
    </Form.Item>
  );

  const rememberNode = (
    <Form.Item>
      <Checkbox
        name="remember"
        onChange={formik.handleChange}
        checked={formik.values.remember}
        disabled={submitResult.loading}
      >
        Remember Me
      </Checkbox>
    </Form.Item>
  );

  return (
    <div className={formClasses.formBodyClassName}>
      <WebHeader />
      <div className={formClasses.formContentWrapperClassName}>
        <form onSubmit={formik.handleSubmit}>
          <Form.Item>
            <Typography.Title level={4}>Login</Typography.Title>
          </Form.Item>
          <FormAlert error={submitResult.error} />
          {emailNode}
          {passwordNode}
          {rememberNode}
          <Form.Item className={css({ marginTop: "16px" })}>
            <Button
              block
              type="primary"
              htmlType="submit"
              loading={submitResult.loading}
            >
              {submitResult.loading ? "Logging In" : "Log In"}
            </Button>
          </Form.Item>
        </form>
      </div>
    </div>
  );
}
