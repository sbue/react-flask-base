import {call, put, takeLatest} from 'redux-saga/effects';

import {signUp} from 'security/actions';
import SecurityApi from 'security/api';
import {flashError} from 'components/Flash';
// import {ROUTES, getPath} from 'routes';
import {goTo} from 'utils/history';

// worker Saga: will be fired on signUp.REQUEST actions
function* signUpSaga(action) {
  let routeKey = '';
  try {
    const responseData = yield call(SecurityApi.signUp, action.payload);
    const user = responseData.user;
    yield put(signUp.success({ user })); // TODO: Add Pending Confirmation
    routeKey = '/';  // ROUTES.Home;
  } catch (error) {
    yield put(signUp.failure(error.message));
    yield flashError(error.message);
  } finally {
    yield put(signUp.fulfill());
    if (!!routeKey) {
      yield call(goTo(routeKey));
    }
  }
}

export default function* signUpSagaRoot() {
  yield takeLatest(signUp.REQUEST, signUpSaga);
}
