import { call, put, takeLatest } from 'redux-saga/effects';

import { fetchUsers } from 'admin/actions';
import AdminApi from 'admin/api';
import {goTo} from 'utils/history';
import {flashInfo} from 'components/Flash';
import {PATHS} from 'config';
import {login} from "../../security/actions";
import {flashError} from "../../components/Flash";

// worker Saga: will be fired on logout.REQUEST actions
function* fetchUsersSaga() {
  try {
    const {users} = yield call(AdminApi.fetchUsers);
    yield put(fetchUsers.success({users}))
  } catch (error) {
    yield put(login.failure(error.message));
    yield flashError(error.message);
  } finally {
    yield put(fetchUsers.fulfill());
  }
}

export default function* fetchUsersSagaRoot() {
  yield takeLatest(fetchUsers.REQUEST, fetchUsersSaga);
}
