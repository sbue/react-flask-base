import { call, put, takeLatest } from 'redux-saga/effects';

import { signUp } from 'security/actions';
import SecurityApi from 'security/api';
import history from 'utils/history';
import { flashError } from '../../components/Flash';

// worker Saga: will be fired on signUp.REQUEST actions
function* signUpSaga(action) {
  let redirectPath = '';
  try {
    const responseData = yield call(SecurityApi.login, action.payload);
    // const accessToken = responseData['access_token'];
    // const refreshToken = responseData['refresh_token'];
    const user = responseData.user;
    yield put(signUp.success({ user }));
    // redirectPath = accessToken ? '/?welcome' : '/pending-confirmation';
    redirectPath = '/';
  } catch (error) {
    yield put(signUp.failure(error.message));
    yield flashError(error.message);
  } finally {
    yield put(signUp.fulfill());
    if (!!redirectPath) {
      yield call(() => history.push(redirectPath));
    }
  }
}

export default function* signUpSagaRoot() {
  yield takeLatest(signUp.REQUEST, signUpSaga);
}
