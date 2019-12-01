import {call, put, takeLatest} from 'redux-saga/effects';
import _ from 'lodash';

import {goTo} from 'utils/history';
import {PATHS} from 'config';
import {flashError, flashSuccess} from 'components/Flash';

import { updateUser } from 'admin/actions';
import AdminApi from 'admin/api';

function* SagaWorker(action) {
  try {
    const {data, userID} = action.payload;
    const filteredData = _.pickBy(data, v => v !== null);
    const user = yield call(AdminApi.updateUser, userID, filteredData);
    yield put(updateUser.success({userID, user}));
    yield flashSuccess(`Successfully updated user ${action.payload.name}.`);
    // yield call(goTo(PATHS.ManageUsers));
    // yield call(goTo(PATHS.ManageUser, {userID}));
  } catch (error) {
    yield put(updateUser.failure(error.message));
    yield flashError(error.message);
  } finally {
    yield put(updateUser.fulfill());
  }
}

export default function* saga() {
  yield takeLatest(updateUser.REQUEST, SagaWorker);
}
