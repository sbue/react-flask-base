import {call, put, takeLatest} from 'redux-saga/effects';

import {PATHS} from 'config';
import {goTo} from 'utils/history';
import {isAuthError, automaticLogout} from 'utils/handleError';
import {flashSuccess, flashError} from 'components/Flash';

import {confirmEmail} from 'account/actions';
import AccountApi from 'account/api';

function* sagaWorker(action) {
  try {
    yield call(AccountApi.confirmEmail, action.payload);
    yield put(confirmEmail.success());
    yield flashSuccess('Your email has been confirmed');
    yield call(goTo(PATHS.Home));
  } catch (error) {
    yield put(confirmEmail.failure());
    if (isAuthError(error)) {
      yield* automaticLogout();
    } else {
      yield flashError(error.message);
      yield call(goTo(PATHS.PendingConfirmation));
    }
  } finally {
    yield put(confirmEmail.fulfill());
  }
}

export default function* saga() {
  yield takeLatest(confirmEmail.REQUEST, sagaWorker);
}
