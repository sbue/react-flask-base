import { call, put, takeLatest } from 'redux-saga/effects';

import { login } from 'security/actions';
import SecurityApi from 'security/api';
// import {ROUTES, getPath} from 'routes';
import {goTo} from 'utils/history';
import { flashSuccess, flashError } from 'components/Flash';

// worker Saga: will be fired on login.REQUEST actions
function* loginSaga(action) {
  let routeKey = '';
  try {
    const responseData = yield call(SecurityApi.login, action.payload);
    const user = responseData.user;
    yield put(login.success({user}));
    routeKey = '/'; // ROUTES.Home; // TODO: add pending confirmation
    yield flashSuccess('You have been successfully logged in.');
  } catch (error) {
    yield put(login.failure(error.message));
    yield flashError(error.message);
  } finally {
    yield put(login.fulfill());
    if (!!routeKey) {
      yield call(goTo(routeKey));
    }
  }
}

export default function* loginSagaRoot() {
  yield takeLatest(login.REQUEST, loginSaga);
}
