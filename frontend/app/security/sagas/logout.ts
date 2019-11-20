import { call, put, takeLatest } from 'redux-saga/effects';

import { logout } from 'security/actions';
import SecurityApi from 'security/api';
import history from 'utils/history';

// worker Saga: will be fired on logout.REQUEST actions
function* logoutSaga(action) {
  let redirectPath = '';
  try {
    yield call(SecurityApi.logout);
    yield put(logout.success());
    redirectPath = '/';
  } catch (error) {
    yield put(logout.failure(error.message));
  } finally {
    yield put(logout.fulfill());
    if (!!redirectPath) {
      yield call(() => history.push(redirectPath));
    }
  }
}

export default function* logoutSagaRoot() {
  yield takeLatest(logout.REQUEST, logoutSaga);
}
