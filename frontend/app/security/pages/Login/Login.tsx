import React, {useRef} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Button, Form, Icon, Input, PageHeader, Spin} from 'antd';

import {PATHS} from 'config';
import {useInjectReducer} from 'utils/injectReducer';
import {useInjectSaga} from 'utils/injectSaga';
import {selectIsLoading} from 'reducers';
import PageContent from 'components/PageContent';
import A from 'components/A';

import {login} from 'security/actions';
import reducer from 'security/reducer';
import saga from 'security/sagas/login';

const key = 'security';

export default function Login() {
  const dispatch = useDispatch();
  const isLoading = useSelector(selectIsLoading);

  const emailInput: any = useRef(null);
  const passwordInput: any = useRef(null);

  // Not gonna declare event types here. No need. any is fine
  const handleSubmit = (evt?: any) => {
    if (evt !== undefined && evt.preventDefault) {
      evt.preventDefault();
    }
    const payload = {
      email: emailInput.current.state.value,
      password: passwordInput.current.state.value,
    };
    dispatch(login.request(payload));
  };

  useInjectReducer({ key: key, reducer: reducer });
  useInjectSaga({ key: key, saga: saga });

  return (
    <PageContent>
      <Spin tip="Loading..." spinning={isLoading}>
        <PageHeader
          style={{
            border: '1px solid rgb(235, 237, 240)',
            marginBottom: '20px',
          }}
          title="Login"
          subTitle="Please login to get started"
        />
        <Form onSubmit={handleSubmit}>
          <Form.Item>
            <Input
              ref={emailInput}
              type="email"
              prefix={<Icon type="mail" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="Email"
            />
          </Form.Item>
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
            Login
          </Button>
          <A route={PATHS.ForgotPassword}  style={{marginLeft: '20px'}}>
            Forgot password?
          </A>
        </Form>
      </Spin>
    </PageContent>
  );
}
