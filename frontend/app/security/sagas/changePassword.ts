import {call, put, takeLatest} from 'redux-saga/effects';

import {PATHS} from 'config';
import {flashSuccess} from 'components/Flash';
import defaultHandleError from 'utils/handleError';
import {goTo} from 'utils/history';
import {changePassword} from 'security/actions';
import SecurityApi from 'security/api';

function* sagaWorker(action) {
  try {
    yield call(SecurityApi.changePassword, action.payload);
    yield put(changePassword.success());
    yield flashSuccess('Your password has been updated.');
    yield call(goTo(PATHS.Settings));
  } catch (error) {
    yield* defaultHandleError(error, changePassword);
  } finally {
    yield put(changePassword.fulfill());
  }
}

export default function* saga() {
  yield takeLatest(changePassword.REQUEST, sagaWorker);
}
