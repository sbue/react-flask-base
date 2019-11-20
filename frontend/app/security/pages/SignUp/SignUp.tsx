/*
 * HomePage
 *
 * This is the first thing users see of our App, at the '/' route
 */

import React, { useRef } from 'react';

import { useDispatch, useSelector } from 'react-redux';

import { useInjectReducer } from 'utils/injectReducer';
import { useInjectSaga } from 'utils/injectSaga';
import { signUp } from 'security/actions';
import reducer, { selectSecurity } from 'security/reducer';
import saga from 'security/sagas/signUp';

import { Input, Button, PageHeader } from 'antd';

const key = 'security';

export default function SignUp() {
  const dispatch = useDispatch();

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
    <div>
      <PageHeader
        style={{
          border: '1px solid rgb(235, 237, 240)',
        }}
        onBack={() => null}
        title="Sign Up"
        subTitle="Sign up to get started!"
      />
      <form>
        <label>
          <p>Email</p>
          <Input ref={emailInput} type="email" name="email" />
        </label>
        <label>
          <p>First Name</p>
          <Input ref={firstNameInput} type="text" name="firstName" />
        </label>
        <label>
          <p>Last Name</p>
          <Input ref={lastNameInput} type="text" name="lastName" />
        </label>
        <label>
          <p>Password</p>
          <Input ref={passwordInput} type="password" name="password" autoComplete="on" />
        </label>
        <Button type="primary" size="large" htmlType="submit" onClick={handleSubmit}>
          Sign Up
        </Button>
      </form>
      </div>
  );
}
