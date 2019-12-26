import React, {useState} from 'react';
import _ from 'lodash';

import {useDispatch, useSelector} from 'react-redux';
import {Button, Form, Icon, Input, PageHeader, Spin, Select} from 'antd';

import {selectIsLoading} from 'reducers';
import {ROLES} from 'config';
import PageContent from 'components/PageContent';
import {useInjectAdminReducer} from 'utils/injectReducer';

import {useInjectSaga} from 'utils/injectSaga';
import {inviteUser} from 'admin/actions';
import saga from 'admin/sagas/inviteUser';

const { Option } = Select;

export default function InviteUser() {
  useInjectAdminReducer();
  useInjectSaga({ key: 'inviteUser', saga: saga });

  const dispatch = useDispatch();
  const isLoading = useSelector(selectIsLoading);

  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [role, setRole] = useState(ROLES.User);

  // Not gonna declare event types here. No need. any is fine
  const handleSubmit = (evt?: any) => {
    if (evt !== undefined && evt.preventDefault) {
      evt.preventDefault();
    }
    const payload = { email, firstName, lastName, role };
    dispatch(inviteUser.request(payload));
  };

  return (
    <PageContent>
      <Spin tip="Loading..." spinning={isLoading}>
        <PageHeader
          style={{
            border: '1px solid rgb(235, 237, 240)',
            marginBottom: '20px',
          }}
          title="Invite User"
          subTitle="Let's add a user"
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
            <Select defaultValue={role} style={{ width: 120 }} onChange={newRole => setRole(newRole)}>
              {_.map(ROLES, (value, key) =>
                <Option value={value} key={value}>{key}</Option>
              )}
            </Select>
          </Form.Item>
          <Button type="primary" size="default" htmlType="submit">
            InviteUser
          </Button>
        </Form>
      </Spin>
    </PageContent>
  );
}
