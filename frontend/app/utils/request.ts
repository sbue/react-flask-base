import * as Cookies from 'js-cookie';
import {CSRF_ACCESS_TOKEN_KEY, CSRF_REFRESH_TOKEN_KEY} from 'utils/constants';

import { SERVER_URL } from 'config';
import {authUrl} from 'api';


// See: https://cdn-media-1.freecodecamp.org/images/1*5vWZxAH-ffLyThTCwTp9ww.png
export async function privateRequest(f: any) {  // TODO: add better typing
  try {
    return await f();
  } catch (error) {
    if (error.response && error.response.status === 401 &&
      Cookies.get(CSRF_REFRESH_TOKEN_KEY)) {
      try {
        await post(authUrl('/refresh-access-token', {}), {},
          {requiresRefresh: true});
        return await f();
      } catch (refreshError) {
        throw refreshError;
      }
    } else {
      throw error;
    }
  }
}

export function get(url, kwargs = {}) {
  const { ...options } = kwargs;
  const requiresAuth = url.startsWith(SERVER_URL);
  const CSRFHeader = requiresAuth ? {
    'X-CSRF-Token': Cookies.get(CSRF_ACCESS_TOKEN_KEY),
  } : {};
  console.log(CSRFHeader);
  const defaults = {
    credentials: 'include',
    headers: {
      ...{
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      ...CSRFHeader,
    },
    method: 'GET',
  };
  return request(url, _mergeOptions(defaults, options));
}

export function post(url, data, kwargs = {requiresRefresh: false}) {
  const { requiresRefresh, ...options } = kwargs;
  const requiresAuth = url.startsWith(SERVER_URL);
  const CSRFHeader = (requiresAuth || requiresRefresh) ? {
    'X-CSRF-Token': (requiresRefresh ?
      Cookies.get(CSRF_REFRESH_TOKEN_KEY) :
      Cookies.get(CSRF_ACCESS_TOKEN_KEY)
    ),
  } : {};
  console.log(CSRFHeader);
  const defaults = {
    credentials: 'include',
    headers: {
      ...{
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      ...CSRFHeader,
    },
    method: 'POST',
    body: JSON.stringify(data),
  };
  return request(url, _mergeOptions(defaults, options));
}

export function put(url, data, options = {}) {
  return post(url, data, _setMethod(options, 'PUT'));
}

export function patch(url, data, options = {}) {
  return post(url, data, _setMethod(options, 'PATCH'));
}

export function delete_(url, options = {}) {
  return get(url, _setMethod(options, 'DELETE'));
}


export class ResponseError extends Error {
  public response: Response;

  constructor(response: Response, responseText: string) {
    const message = responseText ? responseText : response.statusText;
    super(message);
    this.response = response;
  }
}
/**
 * Parses the JSON returned by a network request
 *
 * @param  {object} response      A response from a network request
 *
 * @return {object}          The parsed JSON from the request
 */
function _parseJSON(response: Response) {
  if (response.status === 204 || response.status === 205) {
    return null;
  }
  return response.json();
}

/**
 * Checks if a network request came back fine, and throws an error if not
 *
 * @param  {object} response   A response from a network request
 *
 * @return {object|undefined} Returns either the response, or throws an error
 */
async function _checkStatus(response: Response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  const responseText = await response.text();
  throw new ResponseError(response, responseText);
}

function _mergeOptions(defaults, options) {
  return {
    ...defaults,
    ...options,
    headers: {
      ...defaults.headers,
      ...options.headers,
    },
  };
}

function _setMethod(options, method) {
  return {...options, ...{ method }};
}

/**
 * Requests a URL, returning a promise
 *
 * @param  {string} url           The URL we want to request
 * @param  {object} [options]     The options we want to pass to "fetch"
 *
 * @return {object}           The response data
 */
export default async function request(
  url: string, options?: RequestInit): Promise<{ } | { err: ResponseError }> {

  const fetchResponse = await fetch(url, options);
  const response = await _checkStatus(fetchResponse);
  return _parseJSON(response);
}
