import { call, put, takeLatest } from 'redux-saga/effects';

import { resetPasswordByToken } from 'security/actions';
import SecurityApi from 'security/api';
import {goTo} from 'utils/history';
import {flashSuccess, flashError} from 'components/Flash';
import {PATHS} from 'config';

function* resetPasswordByTokenSaga(action) {
  try {
    const {user, isAdmin} = yield call(SecurityApi.resetPasswordByToken, action.payload);
    yield put(resetPasswordByToken.success({user, isAdmin}));
    yield flashSuccess('Your password has been updated.');
    yield call(goTo(PATHS.Home));
  } catch (error) {
    yield put(resetPasswordByToken.failure());
    yield flashError(error.message);
  } finally {
    yield put(resetPasswordByToken.fulfill());
  }
}

export default function* saga() {
  yield takeLatest(resetPasswordByToken.REQUEST, resetPasswordByTokenSaga);
}
