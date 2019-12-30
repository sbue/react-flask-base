import {call, put, takeLatest} from 'redux-saga/effects';

import {flashSuccess} from 'components/Flash';
import defaultHandleError from 'utils/handleError';
import {updateUser} from 'admin/actions';
import AdminApi from 'admin/api';

function* SagaWorker(action) {
  try {
    const {data, userID} = action.payload;
    const user = yield call(AdminApi.updateUser, userID, data);
    yield put(updateUser.success({userID, user}));
    yield flashSuccess(`Successfully updated user ${action.payload.name}.`);;
  } catch (error) {
    yield* defaultHandleError(error, updateUser);
  } finally {
    yield put(updateUser.fulfill());
  }
}

export default function* saga() {
  yield takeLatest(updateUser.REQUEST, SagaWorker);
}
