import React, {useEffect} from 'react';
import {useDispatch} from 'react-redux';
import queryString from 'query-string'

import {useInjectSecurityReducer} from 'utils/injectReducer';
import {useInjectSaga} from 'utils/injectSaga';
import {logout} from 'security/actions';
import saga from 'security/sagas/logout';

export default function Logout(props) {
  useInjectSecurityReducer();
  useInjectSaga({ key: 'logout', saga: saga });

  const dispatch = useDispatch();

  useEffect(() => {
    const qs = queryString.parse(props.location.search);
    const forced = qs && qs.forced;
    const message = forced ?
      'Your session has expired. Please log back in to continue' :
      'You\'ve logged out';
    dispatch(logout.trigger({message}));
  }, []);

  return null;
}
