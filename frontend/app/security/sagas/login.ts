import { call, put, takeLatest } from 'redux-saga/effects';

import { login } from 'security/actions';
import SecurityApi from 'security/api';
import {PATHS} from 'config';
import {goTo} from 'utils/history';
import { flashSuccess, flashError } from 'components/Flash';

function* loginSaga(action) {
  try {
    const {user, isAdmin, emailConfirmed} = yield call(SecurityApi.login, action.payload);
    yield put(login.success({user, isAdmin}));
    yield flashSuccess('You have been successfully logged in.');
    yield call(goTo(PATHS.Home));  // TODO: add pending confirmation
  } catch (error) {
    yield put(login.failure());
    yield flashError(error.message);
  } finally {
    yield put(login.fulfill());
  }
}

export default function* saga() {
  yield takeLatest(login.REQUEST, loginSaga);
}
