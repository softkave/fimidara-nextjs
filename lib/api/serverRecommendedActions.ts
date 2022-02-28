import KeyValueActions from "../store/key-value/actions";
import { KeyValueKeys } from "../store/key-value/types";
import SessionActions from "../store/session/actions";
import store from "../store/store";
import { IAppError } from "./types";

export enum ServerRecommendedActions {
  LoginAgain = "LoginAgain",
  Logout = "Logout",
}

function getErrorsWithServerRecommendedActions(errors: IAppError[]) {
  return errors.filter((error) => {
    return !!error.action;
  });
}

const shouldLoginAgain = (error: IAppError) => {
  if (
    error.action === ServerRecommendedActions.LoginAgain ||
    error.action === ServerRecommendedActions.Logout
  ) {
    return true;
  }

  return false;
};

export function handleLoginAgainError() {
  store.dispatch(SessionActions.logoutUser());
  store.dispatch(
    KeyValueActions.setKey({
      key: KeyValueKeys.LoginAgain,
      value: true,
    })
  );
}

export function processServerRecommendedActions(errors: IAppError[]) {
  const errorsWithActions = getErrorsWithServerRecommendedActions(errors);

  if (errorsWithActions.length === 0) {
    return true;
  }

  let result = true;

  errorsWithActions.forEach((error) => {
    if (shouldLoginAgain(error)) {
      handleLoginAgainError();
      result = false;
    }
  });

  return result;
}
