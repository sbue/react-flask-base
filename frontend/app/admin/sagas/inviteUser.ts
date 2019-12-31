import {call, put, takeLatest} from 'redux-saga/effects';

import {PATHS} from 'config';
import {flashSuccess} from 'components/Flash';
import defaultHandleError from 'utils/handleError';
import {goTo} from 'utils/history';
import {inviteUser} from 'admin/actions';
import AdminApi from 'admin/api';

function* sagaWorker(action) {
  try {
    const {userID} = yield call(AdminApi.inviteUser, action.payload);
    yield put(inviteUser.success({userID}));
    const fullName = `${action.payload.firstName} ${action.payload.lastName}`;
    yield flashSuccess(`Successfully invited ${fullName}.`);
    yield call(goTo(PATHS.ManageUser, {userID}))
  } catch (error) {
    yield* defaultHandleError(error, inviteUser);
  } finally {
    yield put(inviteUser.fulfill());
  }
}

export default function* saga() {
  yield takeLatest(inviteUser.REQUEST, sagaWorker);
}
