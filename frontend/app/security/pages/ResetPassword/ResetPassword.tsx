import React, {useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Button, Form, Icon, Input, PageHeader, Spin} from 'antd';

import {selectIsLoading} from 'site/reducer';
import {useInjectSecurityReducer} from 'utils/injectReducer';
import {useInjectSaga} from 'utils/injectSaga';
import PageContent from 'components/PageContent';

import {resetPassword} from 'security/actions';
import saga from 'security/sagas/resetPassword';


export default function ResetPassword(props) {
  useInjectSecurityReducer();
  useInjectSaga({ key: 'resetPassword', saga: saga });

  const dispatch = useDispatch();
  const isLoading = useSelector(selectIsLoading);

  const [password, setPassword] = useState("");

  // Not gonna declare event types here. No need. any is fine
  const handleSubmit = (evt?: any) => {
    if (evt !== undefined && evt.preventDefault) {
      evt.preventDefault();
    }
    const payload = {
      password,
      token: props.match.params.token,
    };
    dispatch(resetPassword.request(payload));
  };

  return (
    <PageContent>
      <Spin tip="Loading..." spinning={isLoading}>
        <PageHeader
          style={{
            border: '1px solid rgb(235, 237, 240)',
            marginBottom: '20px',
          }}
          title="Reset Password"
          subTitle="Please enter a new password"
        />
        <Form onSubmit={handleSubmit}>
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
            Reset password
          </Button>
        </Form>
      </Spin>
    </PageContent>
  );
}
