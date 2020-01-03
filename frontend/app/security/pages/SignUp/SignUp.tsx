import React, {useState} from 'react';

import {useDispatch, useSelector} from 'react-redux';
import {Button, Form, Icon, Input, PageHeader, Spin} from 'antd';

import {useInjectSecurityReducer} from 'utils/injectReducer';
import {useInjectSaga} from 'utils/injectSaga';
import {signUp} from 'security/actions';
import saga from 'security/sagas/signUp';
import {selectIsLoading} from 'site/reducer';
import PageContent from 'components/PageContent';


export default function SignUp() {
  useInjectSecurityReducer();
  useInjectSaga({ key: 'signUp', saga: saga });

  const dispatch = useDispatch();
  const isLoading = useSelector(selectIsLoading);

  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");

  // Not gonna declare event types here. No need. any is fine
  const handleSubmit = (evt?: any) => {
    if (evt !== undefined && evt.preventDefault) {
      evt.preventDefault();
    }
    const payload = { email, firstName, lastName, password };
    dispatch(signUp.request(payload));
  };

  return (
    <PageContent>
      <Spin tip="Loading..." spinning={isLoading}>
        <PageHeader
          style={{
            border: '1px solid rgb(235, 237, 240)',
            marginBottom: '20px',
          }}
          title="Sign Up"
          subTitle="Let's get started"
        />
        <Form onSubmit={handleSubmit}>
          <Form.Item>
            <Input
              value={firstName}
              onChange={e => setFirstName(e.target.value)}
              type="text"
              placeholder="First Name"
            />
          </Form.Item>
          <Form.Item>
            <Input
              value={lastName}
              onChange={e => setLastName(e.target.value)}
              type="text"
              placeholder="Last Name"
            />
          </Form.Item>
          <Form.Item>
            <Input
              value={email}
              onChange={e => setEmail(e.target.value)}
              type="email"
              prefix={<Icon type="mail" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="Email"
            />
          </Form.Item>
          <Form.Item>
            <Input
              value={password}
              onChange={e => setPassword(e.target.value)}
              type="password"
              prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="Password"
              autoComplete="on"
            />
          </Form.Item>
          <Button type="primary" size="default" htmlType="submit">
            Sign Up
          </Button>
        </Form>
      </Spin>
    </PageContent>
  );
}
