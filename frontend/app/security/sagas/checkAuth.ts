import { call, put, takeLatest } from 'redux-saga/effects';

import { checkAuth } from 'security/actions';
import SecurityApi from 'security/api';

// worker Saga: will be fired on checkAuth.REQUEST actions
function* checkAuthSaga() {
  try {
    const {user, isAdmin} = yield call(SecurityApi.checkAuth);
    yield put(checkAuth.success({user, isAdmin}));
  } finally {
    yield put(checkAuth.fulfill());
  }
}

export default function* checkAuthSagaRoot() {
  yield takeLatest(checkAuth.REQUEST, checkAuthSaga);
}
