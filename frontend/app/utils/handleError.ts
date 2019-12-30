import {call, put} from 'redux-saga/effects';
import {goTo} from 'utils/history';
import {PATHS} from 'config';
import {flashError} from 'components/Flash';

export function isAuthError(error) {
  return error.response && error.response.status === 401;
}

export function* automaticLogout() {
  yield call(goTo(`${PATHS.Logout}?forced=true`));
}

export default function* defaultHandleError(error, actionRoutine) {
  yield put(actionRoutine.failure());
  if (isAuthError(error)) {
    yield* automaticLogout();
  } else {
    yield flashError(error.message);
  }
}
