import {call, put, takeLatest} from 'redux-saga/effects';

import {flashSuccess} from 'components/Flash';
import defaultHandleError from 'utils/handleError';
import {resendConfirmationEmail} from 'account/actions';
import AccountApi from 'account/api';

function* sagaWorker(action) {
  try {
    yield call(AccountApi.resendConfirmationEmail);
    yield put(resendConfirmationEmail.success());
    yield flashSuccess(`A new confirmation link has been sent to ${action.payload.email}`);
  } catch (error) {
    yield* defaultHandleError(error, resendConfirmationEmail);
  } finally {
    yield put(resendConfirmationEmail.fulfill());
  }
}

export default function* saga() {
  yield takeLatest(resendConfirmationEmail.REQUEST, sagaWorker);
}
