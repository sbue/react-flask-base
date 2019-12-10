import React, {useEffect} from 'react';
import {useDispatch} from 'react-redux';

import {useInjectSecurityReducer} from 'utils/injectReducer';
import {useInjectSaga} from 'utils/injectSaga';
import {confirmEmail} from 'security/actions';
import saga from 'security/sagas/confirmEmail';

export default function ConfirmEmail(props) {
  useInjectSecurityReducer();
  useInjectSaga({ key: 'confirmEmail', saga: saga });

  const dispatch = useDispatch();
  const token = props.match.params.token;

  useEffect(() => {
    dispatch(confirmEmail.request({token}));
  }, []);

  return null;
}
