import React, {useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Button, Form, Icon, Input, PageHeader, Spin} from 'antd';

import {goTo} from 'utils/history';
import {PATHS} from 'config';
import {selectIsLoading} from 'site/reducer';
import {useInjectSecurityReducer} from 'utils/injectReducer';
import {useInjectSaga} from 'utils/injectSaga';
import PageContent from 'components/PageContent';

// import {selectEmail} from 'security/reducer';
import {changePassword} from 'security/actions';
import saga from 'security/sagas/changePassword';


export default function ChangePassword() {
  useInjectSecurityReducer();
  useInjectSaga({ key: 'changePassword', saga: saga });

  const dispatch = useDispatch();
  const isLoading = useSelector(selectIsLoading);
  // const email = useSelector(selectEmail);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleSubmit = (evt?: any) => {
    if (evt !== undefined && evt.preventDefault) {
      evt.preventDefault();
    }
    const payload = { oldPassword, newPassword };
    dispatch(changePassword.request(payload));
  };

  return (
    <PageContent>
      <Spin tip="Loading..." spinning={isLoading}>
        <PageHeader
          style={{
            border: '1px solid rgb(235, 237, 240)',
            marginBottom: '20px',
          }}
          title="Change Password"
          subTitle="Please enter a new password"
          onBack={goTo(PATHS.Settings)}
        />
        <Form onSubmit={handleSubmit}>
          <Form.Item>
            <Input.Password
              value={oldPassword}
              onChange={e => setOldPassword(e.target.value)}
              prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="Old Password"
              autoComplete="current-password"
            />
          </Form.Item>
          <Form.Item>
            {/* TODO: forms should have (optionally hidden) username fields
                for accessibility: (More info: https://goo.gl/9p2vKq */}
            {/*<input hidden type="email" value={email} />*/}
            <Input.Password
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="New Password"
              autoComplete="new-password"
            />
          </Form.Item>
          <Button type="primary" size="default" htmlType="submit">
            Change password
          </Button>
        </Form>
      </Spin>
    </PageContent>
  );
}
