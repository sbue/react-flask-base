import React, {useEffect} from 'react';
import {useDispatch} from 'react-redux';

import {useInjectAccountReducer} from 'utils/injectReducer';
import {useInjectSaga} from 'utils/injectSaga';
import {confirmEmail} from 'account/actions';
import saga from 'account/sagas/confirmEmail';

export default function ConfirmEmail(props) {
  useInjectAccountReducer();
  useInjectSaga({ key: 'confirmEmail', saga: saga });

  const dispatch = useDispatch();
  const token = props.match.params.token;

  useEffect(() => {
    dispatch(confirmEmail.request({token}));
  }, []);

  return null;
}
