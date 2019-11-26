import {call, put, takeLatest} from 'redux-saga/effects';

import {signUp} from 'security/actions';
import SecurityApi from 'security/api';
import {flashError} from 'components/Flash';
import {PATHS} from 'config';
import {goTo} from 'utils/history';

function* signUpSaga(action) {
  try {
    const {user, isAdmin} = yield call(SecurityApi.signUp, action.payload);
    yield put(signUp.success({ user, isAdmin })); // TODO: Add Pending Confirmation
    yield call(goTo(PATHS.Home));
  } catch (error) {
    yield put(signUp.failure());
    yield flashError(error.message);
  } finally {
    yield put(signUp.fulfill());
  }
}

export default function* saga() {
  yield takeLatest(signUp.REQUEST, signUpSaga);
}
