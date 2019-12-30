import {call, put, takeLatest} from 'redux-saga/effects';

import {flashSuccess} from 'components/Flash';
import defaultHandleError from 'utils/handleError';
import {changeUserInfo} from 'security/actions';
import SecurityApi from 'security/api';

function* sagaWorker(action) {
  try {
    const response = yield call(SecurityApi.changeUserInfo, action.payload);
    yield put(changeUserInfo.success(response));
    yield flashSuccess('Your info has been updated.');
  } catch (error) {
    yield* defaultHandleError(error, changeUserInfo);
  } finally {
    yield put(changeUserInfo.fulfill());
  }
}

export default function* saga() {
  yield takeLatest(changeUserInfo.REQUEST, sagaWorker);
}
