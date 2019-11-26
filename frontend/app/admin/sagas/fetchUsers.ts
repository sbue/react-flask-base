import { call, put, takeLatest } from 'redux-saga/effects';

import { fetchUsers } from 'admin/actions';
import AdminApi from 'admin/api';
import {flashError} from "components/Flash";

export function* fetchUsersSaga() {
  try {
    const users = yield call(AdminApi.fetchUsers);
    yield put(fetchUsers.success({users}))
  } catch (error) {
    yield put(fetchUsers.failure(error.message));
    yield flashError(error.message);
  } finally {
    yield put(fetchUsers.fulfill());
  }
}

export default function* saga() {
  yield takeLatest(fetchUsers.REQUEST, fetchUsersSaga);
}
