import { call, put, takeLatest } from 'redux-saga/effects';

import { forgotPassword } from 'security/actions';
import SecurityApi from 'security/api';
import { flashSuccess, flashError } from 'components/Flash';

function* forgotPasswordSaga(action) {
  try {
    const {email} = action.payload;
    yield call(SecurityApi.forgotPassword, {email});
    yield put(forgotPassword.success());
    yield flashSuccess(`A password reset link has been sent to ${email}`);
  } catch (error) {
    yield put(forgotPassword.failure());
    yield flashError(error.message);
  } finally {
    yield put(forgotPassword.fulfill());
  }
}

export default function* saga() {
  yield takeLatest(forgotPassword.REQUEST, forgotPasswordSaga);
}
