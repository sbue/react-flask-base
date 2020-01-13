import { call, put, takeLatest } from 'redux-saga/effects';

import { checkAuth } from 'account/actions';
import AccountApi from 'account/api';
import {goTo} from 'utils/history';
import {PATHS} from 'config';
import {flashInfo} from 'components/Flash';

function* sagaWorker(action) {
  try {
    const response = yield call(AccountApi.checkAuth);
    yield put(checkAuth.success(response));
  } catch (error) {
    yield put(checkAuth.failure());
    if (action.payload.isAuthenticated) {
      yield flashInfo('You\'ve logged out');
      yield call(goTo(PATHS.Home));
    }
  }
}

export default function* saga() {
  yield takeLatest(checkAuth.TRIGGER, sagaWorker);
}
