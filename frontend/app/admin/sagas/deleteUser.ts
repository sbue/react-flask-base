import {call, put, takeLatest} from 'redux-saga/effects';

import {goTo} from 'utils/history';
import {PATHS} from 'config';
import {flashError, flashSuccess} from 'components/Flash';

import { deleteUser } from 'admin/actions';
import AdminApi from 'admin/api';

export function* deleteUserSaga(action) {
  try {
    const users = yield call(AdminApi.deleteUserByID, action.payload.userID);
    yield put(deleteUser.success({users}));
    yield flashSuccess(`Successfully deleted user ${action.payload.name}.`);
    yield call(goTo(PATHS.ManageUsers));
  } catch (error) {
    yield put(deleteUser.failure(error.message));
    yield flashError(error.message);
  } finally {
    yield put(deleteUser.fulfill());
  }
}

export default function* saga() {
  yield takeLatest(deleteUser.REQUEST, deleteUserSaga);
}
