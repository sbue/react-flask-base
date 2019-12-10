import React, {useEffect} from 'react';
import {useDispatch} from 'react-redux';

import {useInjectSecurityReducer} from 'utils/injectReducer';
import {useInjectSaga} from 'utils/injectSaga';
import {checkAuth} from 'security/actions';
import saga from 'security/sagas/checkAuth';

export default function CheckAuth() {
  useInjectSecurityReducer();
  useInjectSaga({ key: 'checkAuth', saga: saga });

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkAuth.trigger());
  }, []);

  return null;
}
