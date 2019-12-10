import { call, put, takeLatest } from 'redux-saga/effects';

import { changePassword } from 'security/actions';
import SecurityApi from 'security/api';
import {flashSuccess, flashError} from 'components/Flash';

function* sagaWorker(action) {
  try {
    yield call(SecurityApi.changePassword, action.payload);
    yield put(changePassword.success());
    yield flashSuccess('Your password has been updated.');
  } catch (error) {
    yield put(changePassword.failure());
    yield flashError(error.message);
  } finally {
    yield put(changePassword.fulfill());
  }
}

export default function* saga() {
  yield takeLatest(changePassword.REQUEST, sagaWorker);
}
