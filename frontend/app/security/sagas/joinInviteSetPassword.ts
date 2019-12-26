import {call, put, takeLatest} from 'redux-saga/effects';

import {joinInviteSetPassword} from 'security/actions';
import SecurityApi from 'security/api';
import {goTo} from 'utils/history';
import {flashSuccess, flashError} from 'components/Flash';
import {PATHS} from 'config';

function* sagaWorker(action) {
  try {
    const response = yield call(SecurityApi.joinInviteSetPassword, action.payload);
    yield put(joinInviteSetPassword.success(response));
    yield flashSuccess('Your password has been set successfully');
    yield call(goTo(PATHS.Home));
  } catch (error) {
    yield put(joinInviteSetPassword.failure());
    yield flashError(error.message);
  } finally {
    yield put(joinInviteSetPassword.fulfill());
  }
}

export default function* saga() {
  yield takeLatest(joinInviteSetPassword.REQUEST, sagaWorker);
}
