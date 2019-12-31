import {call, put, takeLatest} from 'redux-saga/effects';

import {PATHS} from 'config';
import {flashSuccess} from 'components/Flash';
import defaultHandleError from 'utils/handleError';
import {goTo} from 'utils/history';
import {changeEmail} from 'security/actions';
import SecurityApi from 'security/api';

function* sagaWorker(action) {
  try {
    const {newEmail} = action.payload;
    yield call(SecurityApi.changeEmail, {newEmail});
    yield put(changeEmail.success({newEmail}));
    yield flashSuccess('Your email has been updated.');
    yield call(goTo(PATHS.Settings));
  } catch (error) {
    yield* defaultHandleError(error, changeEmail);
  } finally {
    yield put(changeEmail.fulfill());
  }
}

export default function* saga() {
  yield takeLatest(changeEmail.REQUEST, sagaWorker);
}
