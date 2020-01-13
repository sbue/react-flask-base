import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Button, PageHeader, Spin} from 'antd';

import {useInjectAccountReducer} from 'utils/injectReducer';
import {useInjectSaga} from 'utils/injectSaga';
import {selectIsLoading} from 'site/reducer';
import PageContent from 'components/PageContent';

import {selectEmail} from 'account/reducer';
import {resendConfirmationEmail} from 'account/actions';
import saga from 'account/sagas/resendConfirmation';

export default function PendingConfirmation() {

  const dispatch = useDispatch();
  const isLoading = useSelector(selectIsLoading);
  const email = useSelector(selectEmail);

  useInjectAccountReducer();
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
