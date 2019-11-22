import { call, put, takeLatest } from 'redux-saga/effects';

import { logout } from 'security/actions';
import SecurityApi from 'security/api';
// import {ROUTES, getPath} from 'routes';
import {goTo} from 'utils/history';
import {flashInfo} from 'components/Flash';

// worker Saga: will be fired on logout.REQUEST actions
function* logoutSaga() {
  try {
    yield call(SecurityApi.logout);
  } finally {
    yield flashInfo('You\'ve logged out');
    yield put(logout.fulfill());
    yield call(goTo('/'));
  }
}

export default function* logoutSagaRoot() {
  yield takeLatest(logout.REQUEST, logoutSaga);
}
