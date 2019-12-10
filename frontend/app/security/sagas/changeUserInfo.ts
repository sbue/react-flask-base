import {call, put, takeLatest} from 'redux-saga/effects';

import {changeUserInfo} from 'security/actions';
import SecurityApi from 'security/api';
import {flashSuccess, flashError} from 'components/Flash';

function* sagaWorker(action) {
  try {
    const response = yield call(SecurityApi.changeUserInfo, action.payload);
    yield put(changeUserInfo.success(response));
    yield flashSuccess('Your info has been updated.');
  } catch (error) {
    yield put(changeUserInfo.failure());
    yield flashError(error.message);
  } finally {
    yield put(changeUserInfo.fulfill());
  }
}

export default function* saga() {
  yield takeLatest(changeUserInfo.REQUEST, sagaWorker);
}
