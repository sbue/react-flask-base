import { call, put, takeLatest } from 'redux-saga/effects';

import { login } from 'security/actions';
import SecurityApi from 'security/api';
import history from 'utils/history';
import { flashSuccess, flashError } from 'components/Flash';

// worker Saga: will be fired on login.REQUEST actions
function* loginSaga(action) {
  let redirectPath = '';
  try {
    const responseData = yield call(SecurityApi.login, action.payload);
    const user = responseData.user;
    yield put(login.success({user}));
    redirectPath = '/';
    // redirectPath = accessToken ? '/?welcome' : '/pending-confirmation';
    yield flashSuccess('You have been successfully logged in.');
  } catch (error) {
    yield put(login.failure(error.message));
    yield flashError(error.message);
  } finally {
    yield put(login.fulfill());
    if (!!redirectPath) {
      yield call(() => history.push(redirectPath));
    }
  }
}

export default function* loginSagaRoot() {
  yield takeLatest(login.REQUEST, loginSaga);
}
