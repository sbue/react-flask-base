import React, {useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Button, Form, Icon, Input, PageHeader, Spin} from 'antd';

import {PATHS} from 'config';

import {useInjectSecurityReducer} from 'utils/injectReducer';
import {useInjectSaga} from 'utils/injectSaga';
import {selectIsLoading} from 'site/reducer';
import PageContent from 'components/PageContent';
import A from 'components/A';

import {login} from 'security/actions';
import saga from 'security/sagas/login';


export default function Login() {
  useInjectSecurityReducer();
  useInjectSaga({ key: 'login', saga: saga });

  const dispatch = useDispatch();
  const isLoading = useSelector(selectIsLoading);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Not gonna declare event types here. No need. any is fine
  const handleSubmit = (evt?: any) => {
    if (evt !== undefined && evt.preventDefault) {
      evt.preventDefault();
    }
    const payload = { email, password };
    dispatch(login.request(payload));
  };

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
          <Form.Item validateStatus="success">
            <Input
              value={email}
              onChange={e => setEmail(e.target.value)}
              type="email"
              prefix={<Icon type="mail" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="Email"
            />
          </Form.Item>
          <Form.Item>
            <Input.Password
              value={password}
              onChange={e => setPassword(e.target.value)}
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
