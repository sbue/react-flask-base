import {call, put, takeLatest} from 'redux-saga/effects';

import {PATHS} from 'config';
import {goTo} from 'utils/history';
import defaultHandleError from 'utils/handleError';
import {signUp} from 'security/actions';
import SecurityApi from 'security/api';

function* sagaWorker(action) {
  try {
    const response = yield call(SecurityApi.signUp, action.payload);
    yield put(signUp.success(response));
    yield call(goTo(response.verifiedEmail ? PATHS.Home : PATHS.PendingConfirmation));
  } catch (error) {
    yield* defaultHandleError(error, signUp);
  } finally {
    yield put(signUp.fulfill());
  }
}

export default function* saga() {
  yield takeLatest(signUp.REQUEST, sagaWorker);
}
