/*
 * Login
 *
 * This is the login page
 */

import React, { useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useInjectReducer } from 'utils/injectReducer';
import { useInjectSaga } from 'utils/injectSaga';
import { login } from 'security/actions';
import reducer, { selectSecurity } from 'security/reducer';
import saga from 'security/sagas/login';

import { Input, Button, PageHeader, Form, Icon } from 'antd';

const key = 'security';

export default function Login() {
  const dispatch = useDispatch();
  const security = useSelector(selectSecurity);

  const emailInput: any = useRef(null);
  const passwordInput: any = useRef(null);

  // Not gonna declare event types here. No need. any is fine
  const handleSubmit = (evt?: any) => {
    if (evt !== undefined && evt.preventDefault) {
      evt.preventDefault();
    }
    const currentFormValue = {
      email: emailInput.current.state.value,
      password: passwordInput.current.state.value,
    };
    dispatch(login.request(currentFormValue));
  };

  useInjectReducer({ key: key, reducer: reducer });
  useInjectSaga({ key: key, saga: saga });

  return (
    <div>
      <PageHeader
        style={{
          border: '1px solid rgb(235, 237, 240)',
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
      </Form>
    </div>
  );
}
