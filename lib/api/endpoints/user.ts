import { IUser, IUserInput, IUserProfileInput } from "../../definitions/user";
import {
  GetEndpointResult,
  GetEndpointResultError,
  IEndpointResultBase,
} from "../types";
import { invokeEndpoint, invokeEndpointWithAuth } from "../utils";

const baseURL = "/account";
const signupURL = `${baseURL}/signup`;
const loginURL = `${baseURL}/login`;
const updateUserURL = `${baseURL}/updateUser`;
const changePasswordURL = `${baseURL}/changePassword`;
const forgotPasswordURL = `${baseURL}/forgotPassword`;
const userExistsURL = `${baseURL}/userExists`;
const changePasswordWithTokenURL = `${baseURL}/changePasswordWithToken`;
const getUserDataURL = `${baseURL}/getUserData`;
const sendEmailVerificationCodeURL = `${baseURL}/sendEmailVerificationCode`;
const confirmEmailAddressURL = `${baseURL}/confirmEmailAddress`;

export type IUserLoginResult = GetEndpointResult<{
  user: IUser;
  token: string;
}>;

export interface ISignupAPIProps extends Required<IUserInput> {}

export type ISignupEndpointErrors = GetEndpointResultError<ISignupAPIProps>;

async function signup(props: ISignupAPIProps) {
  const result = await invokeEndpoint<IUserLoginResult>({
    path: signupURL,
    data: props,
  });

  return result;
}

export interface ILoginAPIProps {
  email: string;
  password: string;
}

export type ILoginEndpointErrors = GetEndpointResultError<ILoginAPIProps>;

async function login(props: ILoginAPIProps): Promise<IUserLoginResult> {
  const result = await invokeEndpoint<IUserLoginResult>({
    path: loginURL,
    data: props,
  });

  return result;
}

export interface IUpdateUserAPIProps extends IUserProfileInput {}

export type IUpdateUserEndpointErrors =
  GetEndpointResultError<IUpdateUserAPIProps>;

async function updateUser(props: IUpdateUserAPIProps) {
  return await invokeEndpointWithAuth<IUserLoginResult>({
    path: updateUserURL,
    data: props,
  });
}

export interface IChangePasswordAPIProps {
  password: string;
}

async function changePassword(props: IChangePasswordAPIProps) {
  return await invokeEndpointWithAuth<IUserLoginResult>({
    path: changePasswordURL,
    data: props,
  });
}

export interface IForgotPasswordAPIProps {
  email: string;
}

export type IForgotPasswordEndpointErrors =
  GetEndpointResultError<IForgotPasswordAPIProps>;

async function forgotPassword(props: IForgotPasswordAPIProps) {
  const result = await invokeEndpoint<IEndpointResultBase>({
    path: forgotPasswordURL,
    data: props,
  });

  return result;
}

export interface IUserExistsEndpointParams {
  email: string;
}

export type IUserExistsEndpointResult = GetEndpointResult<{
  exists: boolean;
}>;

async function userExists(props: IUserExistsEndpointParams) {
  const result = await invokeEndpoint<IUserExistsEndpointResult>({
    path: userExistsURL,
    data: props,
  });

  return result;
}

export interface IChangePasswordWithTokenEndpointParams {
  password: string;
  token: string;
}

export type IChangePasswordWithTokenEndpointErrors =
  GetEndpointResultError<IChangePasswordWithTokenEndpointParams>;

async function changePasswordWithToken(
  props: IChangePasswordWithTokenEndpointParams
) {
  return await invokeEndpointWithAuth<IUserLoginResult>({
    path: changePasswordWithTokenURL,
    data: {
      password: props.password,
    },
    token: props.token,
  });
}

async function sendEmailVerificationCode() {
  return await invokeEndpointWithAuth<IUserLoginResult>({
    path: sendEmailVerificationCodeURL,
  });
}

export interface IConfirmEmailAddressParams {
  token: string;
}

export type IConfirmEmailAddressErrors =
  GetEndpointResultError<IConfirmEmailAddressParams>;

async function confirmEmailAddress(props: IConfirmEmailAddressParams) {
  return await invokeEndpointWithAuth<IUserLoginResult>({
    path: confirmEmailAddressURL,
    token: props.token,
  });
}

export interface IGetUserDataParams {
  token: string;
}

async function getUserData(props: IGetUserDataParams) {
  return await invokeEndpointWithAuth<IUserLoginResult>({
    path: getUserDataURL,
    token: props.token,
  });
}

export default class UserAPI {
  public static signup = signup;
  public static login = login;
  public static updateUser = updateUser;
  public static changePassword = changePassword;
  public static forgotPassword = forgotPassword;
  public static userExists = userExists;
  public static changePasswordWithToken = changePasswordWithToken;
  public static getUserData = getUserData;
  public static sendEmailVerificationCode = sendEmailVerificationCode;
  public static confirmEmailAddress = confirmEmailAddress;
}

export class UserURLs {
  public static signup = signupURL;
  public static login = loginURL;
  public static updateUser = updateUserURL;
  public static changePassword = changePasswordURL;
  public static forgotPassword = forgotPasswordURL;
  public static userExists = userExistsURL;
  public static changePasswordWithToken = changePasswordWithTokenURL;
  public static getUserData = getUserDataURL;
  public static sendEmailVerificationCode = sendEmailVerificationCodeURL;
  public static confirmEmailAddress = confirmEmailAddressURL;
}
