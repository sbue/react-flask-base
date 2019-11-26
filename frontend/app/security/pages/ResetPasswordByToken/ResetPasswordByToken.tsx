import React, {useRef} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Button, Form, Icon, Input, PageHeader, Spin} from 'antd';

import {selectIsLoading} from 'reducers';
import {useInjectReducer} from 'utils/injectReducer';
import {useInjectSaga} from 'utils/injectSaga';
import PageContent from 'components/PageContent';

import {resetPasswordByToken} from 'security/actions';
import reducer from 'security/reducer';
import saga from 'security/sagas/resetPasswordByToken';


const key = 'security';

export default function ResetPasswordByToken(props) {
  const dispatch = useDispatch();
  const isLoading = useSelector(selectIsLoading);

  const passwordInput: any = useRef(null);

  // Not gonna declare event types here. No need. any is fine
  const handleSubmit = (evt?: any) => {
    if (evt !== undefined && evt.preventDefault) {
      evt.preventDefault();
    }
    const payload = {
      password: passwordInput.current.state.value,
      token: props.match.params.token,
    };
    dispatch(resetPasswordByToken.request(payload));
  };

  useInjectReducer({ key: key, reducer: reducer });
  useInjectSaga({ key: key, saga: saga });

  return (
    <PageContent>
      <Spin tip="Loading..." spinning={isLoading}>
        <PageHeader
          style={{
            border: '1px solid rgb(235, 237, 240)',
            marginBottom: "20px",
          }}
          title="Reset Password"
          subTitle="Please enter a new password"
        />
        <Form onSubmit={handleSubmit}>
          <Form.Item>
            <Input
              ref={passwordInput}
              type="password"
              prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="Password"
              autoComplete="on"
            />
          </Form.Item>
          <Button type="primary" size="default" htmlType="submit">
            Reset password
          </Button>
        </Form>
      </Spin>
    </PageContent>
  );
}
