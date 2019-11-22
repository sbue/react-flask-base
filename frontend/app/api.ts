import { stringify } from 'query-string';
import { SERVER_URL } from 'config';

export function apiUrl(uri, queryParams) {
  return _url(`/${uri}`, queryParams);
}

const AUTH_PREFIX = 'auth';
export function authUrl(uri, queryParams) {
  return apiUrl(`${AUTH_PREFIX}${uri}`, queryParams);
}

export function _url(uri, queryParams) {
  const baseUrl = `${SERVER_URL}${uri}`;
  return queryParams
    ? `${baseUrl}?${stringify(queryParams)}`
    : baseUrl;
}
