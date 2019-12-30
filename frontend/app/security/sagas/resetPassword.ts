import {call, put, takeLatest} from 'redux-saga/effects';

import {PATHS} from 'config';
import {goTo} from 'utils/history';
import defaultHandleError from 'utils/handleError';
import {flashSuccess} from 'components/Flash';
import {resetPassword} from 'security/actions';
import SecurityApi from 'security/api';

function* sagaWorker(action) {
  try {
    const response = yield call(SecurityApi.resetPassword, action.payload);
    yield put(resetPassword.success(response));
    yield flashSuccess('Your password has been updated.');
    yield call(goTo(PATHS.Home));
  } catch (error) {
    yield* defaultHandleError(error, resetPassword);
  } finally {
    yield put(resetPassword.fulfill());
  }
}

export default function* saga() {
  yield takeLatest(resetPassword.REQUEST, sagaWorker);
}
