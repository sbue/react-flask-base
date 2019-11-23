import { call, put, takeLatest } from 'redux-saga/effects';

import { login } from 'security/actions';
import SecurityApi from 'security/api';
import {PATHS} from 'config';
import {goTo} from 'utils/history';
import { flashSuccess, flashError } from 'components/Flash';

// worker Saga: will be fired on login.REQUEST actions
function* loginSaga(action) {
  try {
    const {user, isAdmin} = yield call(SecurityApi.login, action.payload);
    yield put(login.success({user, isAdmin}));
    yield flashSuccess('You have been successfully logged in.');
    yield call(goTo(PATHS.Home));  // TODO: add pending confirmation
  } catch (error) {
    yield put(login.failure(error.message));
    yield flashError(error.message);
  } finally {
    yield put(login.fulfill());
  }
}

export default function* loginSagaRoot() {
  yield takeLatest(login.REQUEST, loginSaga);
}
