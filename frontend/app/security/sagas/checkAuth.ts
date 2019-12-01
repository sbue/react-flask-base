import { call, put, takeLatest } from 'redux-saga/effects';

import { checkAuth } from 'security/actions';
import SecurityApi from 'security/api';

function* sagaWorker() {
  try {
    const response = yield call(SecurityApi.checkAuth);
    yield put(checkAuth.success(response));
  } catch (error) {
    yield put(checkAuth.failure());
  }
}

export default function* saga() {
  yield takeLatest(checkAuth.TRIGGER, sagaWorker);
}
