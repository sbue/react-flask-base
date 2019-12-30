import {call, put, takeLatest} from 'redux-saga/effects';

import defaultHandleError from 'utils/handleError';
import {fetchUsers} from 'admin/actions';
import AdminApi from 'admin/api';

function* sagaWorker() {
  try {
    const users = yield call(AdminApi.fetchUsers);
    yield put(fetchUsers.success({users}));
  } catch (error) {
    yield* defaultHandleError(error, fetchUsers);
  } finally {
    yield put(fetchUsers.fulfill());
  }
}

export default function* saga() {
  yield takeLatest(fetchUsers.REQUEST, sagaWorker);
  yield takeLatest(fetchUsers.TRIGGER, sagaWorker);
}
