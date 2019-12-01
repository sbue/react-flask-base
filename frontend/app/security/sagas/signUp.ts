import {call, put, takeLatest} from 'redux-saga/effects';

import {signUp} from 'security/actions';
import SecurityApi from 'security/api';
import {flashError} from 'components/Flash';
import {PATHS} from 'config';
import {goTo} from 'utils/history';

function* sagaWorker(action) {
  try {
    const response = yield call(SecurityApi.signUp, action.payload);
    yield put(signUp.success(response));
    yield call(goTo(response.verifiedEmail ? PATHS.Home : PATHS.PendingConfirmation));
  } catch (error) {
    yield put(signUp.failure());
    yield flashError(error.message);
  } finally {
    yield put(signUp.fulfill());
  }
}

export default function* saga() {
  yield takeLatest(signUp.REQUEST, sagaWorker);
}
