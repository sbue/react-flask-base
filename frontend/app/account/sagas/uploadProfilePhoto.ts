import {call, put, takeLatest} from 'redux-saga/effects';

import {PATHS} from 'config';
import {flashSuccess} from 'components/Flash';
import {goTo} from 'utils/history';
import defaultHandleError from 'utils/handleError';
import {uploadProfilePhoto} from 'account/actions';
import AccountApi from 'account/api';

function* sagaWorker(action) {
  try {
    const response = yield call(AccountApi.uploadProfilePhoto, action.payload);
    yield put(uploadProfilePhoto.success(response));
    yield flashSuccess('Your profile photo has been updated.');
    yield call(goTo(PATHS.Settings));
  } catch (error) {
    yield* defaultHandleError(error, uploadProfilePhoto);
  } finally {
    yield put(uploadProfilePhoto.fulfill());
  }
}

export default function* saga() {
  yield takeLatest(uploadProfilePhoto.REQUEST, sagaWorker);
}
