import {call, put, takeLatest} from 'redux-saga/effects';

import {PATHS} from 'config';
import {flashSuccess} from 'components/Flash';
import {goTo} from 'utils/history';
import defaultHandleError from 'utils/handleError';
import {deleteProfilePhoto} from 'account/actions';
import AccountApi from 'account/api';

function* sagaWorker() {
  try {
    yield call(AccountApi.deleteProfilePhoto);
    yield put(deleteProfilePhoto.success());
    yield flashSuccess('Your profile photo has been deleted.');
    yield call(goTo(PATHS.Settings));
  } catch (error) {
    yield* defaultHandleError(error, deleteProfilePhoto);
  } finally {
    yield put(deleteProfilePhoto.fulfill());
  }
}

export default function* saga() {
  yield takeLatest(deleteProfilePhoto.REQUEST, sagaWorker);
}
