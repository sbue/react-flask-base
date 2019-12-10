import { call, put, takeLatest } from 'redux-saga/effects';

import {deleteAccount} from 'security/actions';
import SecurityApi from 'security/api';
import {flashSuccess, flashError} from 'components/Flash';
import {PATHS} from 'config';
import {goTo} from 'utils/history';

function* sagaWorker() {
  try {
    yield call(SecurityApi.deleteAccount);
    yield put(deleteAccount.success());
    yield flashSuccess('Your account has been deleted.');
    yield call(goTo(PATHS.Home));
  } catch (error) {
    yield put(deleteAccount.failure());
    yield flashError(error.message);
  } finally {
    yield put(deleteAccount.fulfill());
  }
}

export default function* saga() {
  yield takeLatest(deleteAccount.REQUEST, sagaWorker);
}
