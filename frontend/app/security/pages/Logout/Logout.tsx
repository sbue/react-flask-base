import React, {useEffect} from 'react';
import {useDispatch} from 'react-redux';

import {useInjectSecurityReducer} from 'utils/injectReducer';
import {useInjectSaga} from 'utils/injectSaga';
import {logout} from 'security/actions';
import saga from 'security/sagas/logout';

export default function Logout() {
  useInjectSecurityReducer();
  useInjectSaga({ key: 'logout', saga: saga });

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(logout.request());
  }, []);

  return null;
}
