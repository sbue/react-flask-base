import { call, put, takeLatest } from 'redux-saga/effects';

import { resetPassword } from 'security/actions';
import SecurityApi from 'security/api';
import {goTo} from 'utils/history';
import {flashSuccess, flashError} from 'components/Flash';
import {PATHS} from 'config';

function* sagaWorker(action) {
  try {
    const response = yield call(SecurityApi.resetPassword, action.payload);
    yield put(resetPassword.success(response));
    yield flashSuccess('Your password has been updated.');
    yield call(goTo(PATHS.Home));
  } catch (error) {
    yield put(resetPassword.failure());
    yield flashError(error.message);
  } finally {
    yield put(resetPassword.fulfill());
  }
}

export default function* saga() {
  yield takeLatest(resetPassword.REQUEST, sagaWorker);
}
