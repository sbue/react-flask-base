import { call, put, takeLatest } from 'redux-saga/effects';

import { checkAuth } from 'security/actions';
import SecurityApi from 'security/api';

function* checkAuthSaga() {
  try {
    const {user, isAdmin} = yield call(SecurityApi.checkAuth);
    yield put(checkAuth.success({user, isAdmin}));
  } catch (error) {
    yield put(checkAuth.failure());
  }
}

export default function* saga() {
  yield takeLatest(checkAuth.TRIGGER, checkAuthSaga);
}
