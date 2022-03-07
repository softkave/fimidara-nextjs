import { OutgoingHttpHeaders } from "http";
import isString from "lodash/isString";
import last from "lodash/last";
import { IAppError } from "../definitions/system";
import UserSessionStorageFns from "../storage/userSession";
import SessionSelectors from "../store/session/selectors";
import store from "../store/store";
import { flattenErrorList } from "../utilities/utils";
import { getServerAddr } from "./addr";
import { processServerRecommendedActions } from "./serverRecommendedActions";
import { IEndpointResultBase } from "./types";

const isExpectedErrorType = (errors: Error[]) => {
  return Array.isArray(errors) && !!errors.find((e) => !!e.name);
};

export const toAppError = (err: Error | IAppError | string): IAppError => {
  const error = isString(err) ? new Error(err) : err;

  return {
    name: error.name,
    message: error.message,
    action: (error as any).action,
    field: (error as any).field,
  };
};

export const toAppErrorsArray = (err: any) => {
  if (!err) {
    return [];
  }

  if (Array.isArray(err)) {
    return err.map((error) => toAppError(error));
  } else {
    return [toAppError(err)];
  }
};

export const HTTP_HEADER_CONTENT_TYPE = "Content-Type";
export const HTTP_HEADER_AUTHORIZATION = "Authorization";
export const CONTENT_TYPE_APPLICATION_JSON = "application/json";
export const CONTENT_TYPE_MULTIPART_FORMDATA = "multipart/form-data";

export interface IInvokeEndpointParams {
  data?: any;
  path: string;
  headers?: OutgoingHttpHeaders;
  method?: "GET" | "POST";
}

export async function invokeEndpoint<T extends IEndpointResultBase>(
  props: IInvokeEndpointParams
): Promise<T> {
  const { data, path } = props;
  const method = props.method || "POST";
  const incomingHeaders = props.headers || {};
  const contentType =
    incomingHeaders[HTTP_HEADER_CONTENT_TYPE] || CONTENT_TYPE_APPLICATION_JSON;
  const contentBody =
    contentType === CONTENT_TYPE_APPLICATION_JSON ? JSON.stringify(data) : data;
  const httpHeaders = {
    [HTTP_HEADER_CONTENT_TYPE]: contentType,
    ...incomingHeaders,
  };

  try {
    const result = await fetch(getServerAddr() + path, {
      method,
      headers: httpHeaders as HeadersInit,
      body: contentBody,
      mode: "cors",
    });

    // TODO: what if the request fails in the middleware space?
    // i.e maybe auth token decoding error or something
    if (!result.headers.get("Content-Type")?.includes("application/json")) {
      throw new Error("Error completing request");
    }

    const body = (await result.json()) as T;
    let errors: IAppError[] | undefined = undefined;

    if (body) {
      errors = body.errors;
    }

    if (result.ok) {
      if (errors && errors.length > 0) {
        const continueProcessing = processServerRecommendedActions(errors);

        if (continueProcessing) {
          return body;
        } else {
          throw new Error("Error completing request");
        }
      }

      return body;
    } else {
      // TODO: do we still need these?
      if (result.status === 500 || result.status === 401) {
        if (errors) {
          if (isExpectedErrorType(errors)) {
            const continueProcessing = processServerRecommendedActions(errors);

            if (continueProcessing) {
              return body;
            }
          }

          throw new Error("Error completing request");
        }
      }
    }

    throw new Error(result.statusText);
  } catch (error) {
    const errors = toAppErrorsArray(error);
    throw errors;
  }
}

function getTokenFromStore() {
  return SessionSelectors.getUserToken(store.getState());
}

export interface IInvokeEndpointWithAuthParams extends IInvokeEndpointParams {
  token?: string;
}

export async function invokeEndpointWithAuth<T extends IEndpointResultBase>(
  props: IInvokeEndpointWithAuthParams
) {
  const requestToken =
    props.token || getTokenFromStore() || UserSessionStorageFns.getUserToken();

  if (!requestToken) {
    throw new Error("Invalid credentials");
  }

  return invokeEndpoint<T>({
    ...props,
    headers: {
      [HTTP_HEADER_AUTHORIZATION]: `Bearer ${requestToken}`,
      ...props.headers,
    },
  });
}

export function checkEndpointResult<T extends IEndpointResultBase>(result: T) {
  if (result.errors) {
    throw result.errors;
  }

  return result;
}

export function processEndpointError(error: any) {
  const errArray = toAppErrorsArray(error);
  const flattenedErrors = flattenErrorList(errArray);
  return flattenedErrors;
}

export function processAndThrowEndpointError(error: any) {
  throw processEndpointError(error);
}

export function withCheckEndpointResult<
  R extends IEndpointResultBase,
  P extends any[]
>(fn: (...args: P) => Promise<R>) {
  return async (...args: P): Promise<R> => {
    const result = await fn(...args);
    return checkEndpointResult(result);
  };
}

export function getLastPath(p: string) {
  return last(p.split("/"));
}

export function setEndpointFormData(
  formData: FormData,
  name: string,
  data?: string | Blob
) {
  if (data) {
    formData.set(name, data);
  }
}

export function setEndpointParam(
  params: URLSearchParams,
  name: string,
  data: any
) {
  if (data) {
    params.set(name, data);
  }
}
