import { call, put, takeLatest } from 'redux-saga/effects';

import { logout } from 'account/actions';
import AccountApi from 'account/api';
import {goTo} from 'utils/history';
import {flashInfo} from 'components/Flash';
import {PATHS} from 'config';

function* sagaWorker(action) {
  yield put(logout.fulfill());
  yield flashInfo(action.payload.message);
  yield call(goTo(PATHS.Home));
  try {
    yield call(AccountApi.logout);
  } catch (error) {
    // ignore
  }
}

export default function* saga() {
  yield takeLatest(logout.TRIGGER, sagaWorker);
}
