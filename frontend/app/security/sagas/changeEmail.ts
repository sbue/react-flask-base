import {call, put, takeLatest} from 'redux-saga/effects';

import {flashSuccess} from 'components/Flash';
import defaultHandleError from 'utils/handleError';
import {changeEmail} from 'security/actions';
import SecurityApi from 'security/api';

function* sagaWorker(action) {
  try {
    const {newEmail} = action.payload;
    yield call(SecurityApi.changeEmail, {newEmail});
    yield put(changeEmail.success({newEmail}));
    yield flashSuccess('Your email has been updated.');
  } catch (error) {
    yield* defaultHandleError(error, changeEmail);
  } finally {
    yield put(changeEmail.fulfill());
  }
}

export default function* saga() {
  yield takeLatest(changeEmail.REQUEST, sagaWorker);
}
