import { stringify } from 'query-string';
import * as Cookies from 'js-cookie';

import { SERVER_URL } from 'config';


export function url(uri, queryParams) {
  const baseUrl = `${SERVER_URL}${uri}`;
  return queryParams
    ? `${baseUrl}?${stringify(queryParams)}`
    : baseUrl;
}

export function get(url, kwargs = {}) {
  const { ...options } = kwargs;
  const defaults = {
    credentials: 'include',
    headers: {
      ...{
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    },
    method: 'GET',
  };
  return request(url, _mergeOptions(defaults, options));
}

export function post(url, data, kwargs = {}) {
  const { ...options } = kwargs;
  const CSRFToken = Cookies.get('csrf_token');
  const defaults = {
    credentials: 'include',
    headers: {
      ...{
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-CSRFToken': CSRFToken,
      },
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
 * @param  {object} response A response from a network request
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
  const error = new ResponseError(response, responseText);
  error.response = response;
  throw error;
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
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 *
 * @return {object}           The response data
 */
export default async function request(url: string, options?: RequestInit): Promise<{ } | { err: ResponseError }> {
  const fetchResponse = await fetch(url, options);
  const response = await _checkStatus(fetchResponse);
  return _parseJSON(response);
}
