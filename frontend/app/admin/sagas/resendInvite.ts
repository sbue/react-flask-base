import {call, put, takeLatest} from 'redux-saga/effects';

import {flashSuccess} from 'components/Flash';
import defaultHandleError from 'utils/handleError';
import {resendInvite} from 'admin/actions';
import AdminApi from 'admin/api';

function* sagaWorker(action) {
  try {
    const userID = action.payload.userID;
    yield call(AdminApi.resendInvite, userID);
    yield put(resendInvite.success());
    yield flashSuccess(`Successfully resent email invite.`);
  } catch (error) {
    yield* defaultHandleError(error, resendInvite);
  } finally {
    yield put(resendInvite.fulfill());
  }
}

export default function* saga() {
  yield takeLatest(resendInvite.REQUEST, sagaWorker);
}
