import {call, put, takeLatest} from 'redux-saga/effects';

import {flashError, flashSuccess} from 'components/Flash';

import {inviteUser} from 'admin/actions';
import AdminApi from 'admin/api';

function* sagaWorker(action) {
  try {
    yield call(AdminApi.inviteUser, action.payload);
    yield put(inviteUser.success());
    yield flashSuccess(`Successfully invited ${action.payload.firstName} ${action.payload.lastName}.`);
  } catch (error) {
    yield put(inviteUser.failure());
    yield flashError(error.message);
  } finally {
    yield put(inviteUser.fulfill());
  }
}

export default function* saga() {
  yield takeLatest(inviteUser.REQUEST, sagaWorker);
}
