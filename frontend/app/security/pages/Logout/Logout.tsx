/*
 * Logout
 *
 * This is the logout component
 */

import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { useInjectReducer } from 'utils/injectReducer';
import { useInjectSaga } from 'utils/injectSaga';
import { logout } from 'security/actions';
import reducer from 'security/reducer';
import saga from 'security/sagas/logout';

const key = 'security';

export default function Login() {
  const dispatch = useDispatch();

  useInjectReducer({ key: key, reducer: reducer });
  useInjectSaga({ key: key, saga: saga });

  useEffect(() => {
    dispatch(logout.request());
  }, []);

  return null;
}
