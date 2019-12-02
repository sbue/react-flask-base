import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { useInjectReducer } from 'utils/injectReducer';
import { useInjectSaga } from 'utils/injectSaga';
import { confirmEmail } from 'security/actions';
import reducer from 'security/reducer';
import saga from 'security/sagas/confirmEmail';

const key = 'security';

export default function ConfirmEmail(props) {
  const dispatch = useDispatch();
  const token = props.match.params.token;

  useInjectReducer({ key: key, reducer: reducer });
  useInjectSaga({ key: key, saga: saga });

  useEffect(() => {
    dispatch(confirmEmail.request({token}));
  }, []);

  return null;
}
