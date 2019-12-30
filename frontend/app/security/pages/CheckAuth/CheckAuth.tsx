import React, {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import * as Cookies from 'js-cookie';

import {CSRF_ACCESS_TOKEN_KEY, CSRF_REFRESH_TOKEN_KEY} from 'utils/constants';
import {useInjectSecurityReducer} from 'utils/injectReducer';
import {useInjectSaga} from 'utils/injectSaga';
import {checkAuth} from 'security/actions';
import {selectIsAuthenticated} from 'security/reducer';
import saga from 'security/sagas/checkAuth';

export default function CheckAuth() {
  useInjectSecurityReducer();
  useInjectSaga({ key: 'checkAuth', saga: saga });

  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const hasCookies = Cookies.get(CSRF_ACCESS_TOKEN_KEY) && Cookies.get(CSRF_REFRESH_TOKEN_KEY);

  useEffect(() => {
    if (hasCookies) {
      // Trigger instead of request so it doesn't affect the isLoading state
      dispatch(checkAuth.trigger(isAuthenticated));
    }
  }, []);

  return null;
}
