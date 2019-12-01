import { call, put, takeLatest } from 'redux-saga/effects';

import { confirmEmail } from 'security/actions';
import SecurityApi from 'security/api';
import {goTo} from 'utils/history';
import {flashSuccess, flashError} from 'components/Flash';
import {PATHS} from 'config';

function* sagaWorker(action) {
  try {
    yield call(SecurityApi.confirmEmail, action.payload);
    yield put(confirmEmail.success());
    yield flashSuccess('Your email has been confirmed');
    yield call(goTo(PATHS.Home));
  } catch (error) {
    yield put(confirmEmail.failure());
    yield flashError(error.message);
    yield call(goTo(PATHS.PendingConfirmation));
  } finally {
    yield put(confirmEmail.fulfill());
  }
}

export default function* saga() {
  yield takeLatest(confirmEmail.REQUEST, sagaWorker);
}
