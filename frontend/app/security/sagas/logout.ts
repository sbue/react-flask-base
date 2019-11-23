import { call, put, takeLatest } from 'redux-saga/effects';

import { logout } from 'security/actions';
import SecurityApi from 'security/api';
import {goTo} from 'utils/history';
import {flashInfo} from 'components/Flash';
import {PATHS} from 'config';

// worker Saga: will be fired on logout.REQUEST actions
function* logoutSaga() {
  try {
    yield call(SecurityApi.logout);
  } finally {
    yield flashInfo('You\'ve logged out');
    yield put(logout.fulfill());
    yield call(goTo(PATHS.Home));
  }
}

export default function* logoutSagaRoot() {
  yield takeLatest(logout.REQUEST, logoutSaga);
}
