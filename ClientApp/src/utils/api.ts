import { includes } from 'lodash';

export type HttpMethod = 'DELETE' | 'GET' | 'POST' | 'PUT';

export const createRequestInit = <T>(
  httpMethod: HttpMethod,
  body?: T
): RequestInit =>
  ({
    headers: {
      Accept: 'application/json',
      'Cache-Control': 'no-cache',
      'Content-Type': 'application/json',
    },
    method: httpMethod,
    credentials: 'same-origin',
    body: body ? JSON.stringify(body) : undefined,
  } as RequestInit);

const parseResponse = <T>(response: Response): Promise<T> => {
  return includes(
    response.headers.get('content-type') as string,
    'application/json'
  )
    ? response.json()
    : response.text();
};

export type ApiRequestError = {
  statusCode: number;
  statusText: string;
};

export const isApiRequestError = <T>(
  x: T | ApiRequestError
): x is ApiRequestError => (x as ApiRequestError).statusCode !== undefined;

export const apiRequest = <T>(
  requestInfo: RequestInfo,
  requestInit: RequestInit
): Promise<T | ApiRequestError> => {
  return fetch(requestInfo, requestInit).then(async (response) => {
    if (!response.ok) {
      return {
        statusCode: response.status,
        statusText: await response.text(),
      };
    }
    return await parseResponse<T>(response);
  });
};
