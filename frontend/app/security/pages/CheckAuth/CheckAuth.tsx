import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { useInjectReducer } from 'utils/injectReducer';
import { useInjectSaga } from 'utils/injectSaga';
import { checkAuth } from 'security/actions';
import reducer from 'security/reducer';
import saga from 'security/sagas/checkAuth';

const key = 'security';

export default function CheckAuth() {
  const dispatch = useDispatch();

  useInjectReducer({ key: key, reducer: reducer });
  useInjectSaga({ key: key, saga: saga });

  useEffect(() => {
    dispatch(checkAuth.trigger());
  }, []);

  return null;
}
