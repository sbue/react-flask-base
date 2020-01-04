import _ from 'lodash';
import {call, put, takeLatest} from 'redux-saga/effects';

import {PATHS} from 'config';
import defaultHandleError from 'utils/handleError';
import {goTo} from 'utils/history';
import {flashError} from 'components/Flash';
import {fetchUsers} from 'admin/actions';
import AdminApi from 'admin/api';

function* sagaWorker(action) {
  try {
    const users = yield call(AdminApi.fetchUsers);
    yield put(fetchUsers.success({users}));
    const userID = action.payload ? action.payload.userID : null;
    if (userID && !_.has(users, userID)) {
      yield flashError("User does not exist.");
      yield call(goTo(PATHS.Home))
    }
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
