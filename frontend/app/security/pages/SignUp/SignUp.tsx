/*
 * HomePage
 *
 * This is the first thing users see of our App, at the '/' route
 */

import React, {useRef} from 'react';

import {useDispatch, useSelector} from 'react-redux';
import {Button, Form, Icon, Input, PageHeader, Spin} from 'antd';

import {useInjectReducer} from 'utils/injectReducer';
import {useInjectSaga} from 'utils/injectSaga';
import {signUp} from 'security/actions';
import reducer from 'security/reducer';
import saga from 'security/sagas/signUp';
import {selectLoading} from 'reducers';
import PageContent from 'components/PageContent';

const key = 'security';

export default function SignUp() {
  const dispatch = useDispatch();
  const isLoading = useSelector(selectLoading) == 1;

  const emailInput: any = useRef(null);
  const firstNameInput: any = useRef(null);
  const lastNameInput: any = useRef(null);
  const passwordInput: any = useRef(null);

  // Not gonna declare event types here. No need. any is fine
  const handleSubmit = (evt?: any) => {
    if (evt !== undefined && evt.preventDefault) {
      evt.preventDefault();
    }
    const currentFormValue = {
      email: emailInput.current.state.value,
      first_name: firstNameInput.current.state.value,
      last_name: lastNameInput.current.state.value,
      password: passwordInput.current.state.value,
    };
    dispatch(signUp.request(currentFormValue));
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
          title="Sign Up"
          subTitle="Let's get started"
        />
        <Form onSubmit={handleSubmit}>
          <Form.Item>
            <Input
              ref={firstNameInput}
              type="text"
              placeholder="First Name"
            />
          </Form.Item>
          <Form.Item>
            <Input
              ref={lastNameInput}
              type="text"
              placeholder="Last Name"
            />
          </Form.Item>
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
            Sign Up
          </Button>
        </Form>
      </Spin>
    </PageContent>
  );
}
