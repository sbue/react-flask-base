import {call, put, takeLatest} from 'redux-saga/effects';

import {flashError, flashSuccess} from 'components/Flash';
import defaultHandleError from 'utils/handleError';
import {resendConfirmationEmail} from 'security/actions';
import SecurityApi from 'security/api';

function* sagaWorker(action) {
  try {
    yield call(SecurityApi.resendConfirmationEmail);
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
