import {call, put, takeLatest} from 'redux-saga/effects';

import {PATHS} from 'config';
import {flashSuccess} from 'components/Flash';
import {goTo} from 'utils/history';
import defaultHandleError from 'utils/handleError';
import {deleteAccount} from 'account/actions';
import AccountApi from 'account/api';

function* sagaWorker() {
  try {
    yield call(AccountApi.deleteAccount);
    yield put(deleteAccount.success());
    yield flashSuccess('Your account has been deleted.');
    yield call(goTo(PATHS.Home));
  } catch (error) {
    yield* defaultHandleError(error, deleteAccount);
  } finally {
    yield put(deleteAccount.fulfill());
  }
}

export default function* saga() {
  yield takeLatest(deleteAccount.REQUEST, sagaWorker);
}
