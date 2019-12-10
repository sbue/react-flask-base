import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Button, PageHeader, Spin} from 'antd';

import {useInjectSecurityReducer} from 'utils/injectReducer';
import {useInjectSaga} from 'utils/injectSaga';
import {selectIsLoading} from 'reducers';
import PageContent from 'components/PageContent';

import {selectEmail} from 'security/reducer';
import {resendConfirmationEmail} from 'security/actions';
import saga from 'security/sagas/resendConfirmation';

export default function PendingConfirmation() {

  const dispatch = useDispatch();
  const isLoading = useSelector(selectIsLoading);
  const email = useSelector(selectEmail);

  useInjectSecurityReducer();
  useInjectSaga({ key: 'pendingConfirmation', saga: saga });

  return (
    <PageContent>
      <Spin tip="Loading..." spinning={isLoading}>
        <PageHeader
          style={{
            border: '1px solid rgb(235, 237, 240)',
            marginBottom: '20px',
          }}
          title="Please Confirm your Email Address"
          subTitle=""
        />
        <h4>Thanks for signing up!</h4>
        <p>Please check your email to confirm your email address and login.</p>
        <Button type="primary" onClick={() => dispatch(resendConfirmationEmail.request({email}))}>
          Resend confirmation email
        </Button>
      </Spin>
    </PageContent>
  );
}
