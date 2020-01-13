import React, {useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Button, Form, Icon, Input, PageHeader, Spin} from 'antd';

import {selectIsLoading} from 'site/reducer';
import {useInjectAccountReducer} from 'utils/injectReducer';
import {useInjectSaga} from 'utils/injectSaga';
import PageContent from 'components/PageContent';

import {joinInviteSetPassword} from 'account/actions';
import saga from 'account/sagas/joinInviteSetPassword';


export default function JoinFromInvite(props) {
  useInjectAccountReducer();
  useInjectSaga({ key: 'joinInvite', saga: saga });

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
    dispatch(joinInviteSetPassword.request(payload));
  };

  return (
    <PageContent>
      <Spin tip="Loading..." spinning={isLoading}>
        <PageHeader
          style={{
            border: '1px solid rgb(235, 237, 240)',
            marginBottom: '20px',
          }}
          title="Create your password"
          subTitle="Please enter a password to get started"
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
            Set Password
          </Button>
        </Form>
      </Spin>
    </PageContent>
  );
}
