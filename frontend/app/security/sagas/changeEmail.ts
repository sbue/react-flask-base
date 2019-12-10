import { call, put, takeLatest } from 'redux-saga/effects';

import { changeEmail } from 'security/actions';
import SecurityApi from 'security/api';
import {flashSuccess, flashError} from 'components/Flash';

function* sagaWorker(action) {
  try {
    const {newEmail} = action.payload;
    yield call(SecurityApi.changeEmail, {newEmail});
    yield put(changeEmail.success({newEmail}));
    yield flashSuccess('Your email has been updated.');
  } catch (error) {
    yield put(changeEmail.failure());
    yield flashError(error.message);
  } finally {
    yield put(changeEmail.fulfill());
  }
}

export default function* saga() {
  yield takeLatest(changeEmail.REQUEST, sagaWorker);
}
