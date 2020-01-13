import {call, put, takeLatest} from 'redux-saga/effects';

import {PATHS} from 'config';
import {goTo} from 'utils/history';
import defaultHandleError from 'utils/handleError';
import {flashSuccess} from 'components/Flash';
import {login} from 'account/actions';
import AccountApi from 'account/api';

function* sagaWorker(action) {
  try {
    const response = yield call(AccountApi.login, action.payload);
    yield put(login.success(response));
    yield flashSuccess('You have been successfully logged in.');
    yield call(goTo(response.verifiedEmail ? PATHS.Home : PATHS.PendingConfirmation));
  } catch (error) {
    yield* defaultHandleError(error, login);
  } finally {
    yield put(login.fulfill());
  }
}

export default function* saga() {
  yield takeLatest(login.REQUEST, sagaWorker);
}
