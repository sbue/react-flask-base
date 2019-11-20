import { call, put, takeLatest } from 'redux-saga/effects';

import { refreshAccessToken } from 'security/actions';
import SecurityApi from 'security/api';
import { decode as jwt_decode } from 'jsonwebtoken';
import { JWT_ACCESS_COOKIE_NAME } from 'utils/constants';
import Cookies from 'js-cookie';

export function accessTokenHasExpired(accessToken) {
  const decoded: any = jwt_decode(accessToken);  // TODO: add better typing
  return !(decoded && decoded.exp * 1000 >= Date.now());
}

// worker Saga: will be fired on USER_FETCH_REQUESTED actions
export default function* refreshAccessTokenSaga(action) {
  const accessToken = Cookies.get(JWT_ACCESS_COOKIE_NAME);
  if (accessTokenHasExpired(accessToken)) {
    try {
      const responseData = yield call(SecurityApi.refreshAccessToken);
      const accessToken = responseData['access_token'];
      yield put(refreshAccessToken.success({ accessToken }));
    } catch (error) {
      yield put(refreshAccessToken.failure(error.message));
    } finally {
      yield put(refreshAccessToken.fulfill());
    }
  }
}
