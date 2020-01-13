import {call, put, takeLatest} from 'redux-saga/effects';

import {PATHS} from 'config';
import {goTo} from 'utils/history';
import defaultHandleError from 'utils/handleError';
import {flashSuccess} from 'components/Flash';
import {joinInviteSetPassword} from 'account/actions';
import AccountApi from 'account/api';

function* sagaWorker(action) {
  try {
    const response = yield call(AccountApi.joinInviteSetPassword, action.payload);
    yield put(joinInviteSetPassword.success(response));
    yield flashSuccess('Your password has been set successfully');
    yield call(goTo(PATHS.Home));
  } catch (error) {
    yield* defaultHandleError(error, joinInviteSetPassword);
  } finally {
    yield put(joinInviteSetPassword.fulfill());
  }
}

export default function* saga() {
  yield takeLatest(joinInviteSetPassword.REQUEST, sagaWorker);
}
