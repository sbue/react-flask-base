/*
 * Logout
 *
 * This is the logout component
 */

import React, {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {PageHeader, Spin, Popconfirm, Button, Icon, Descriptions} from 'antd';
import _ from 'lodash';

import {useInjectReducer} from 'utils/injectReducer';
import {useInjectMultipleSagas} from 'utils/injectSaga';
import PageContent from 'components/PageContent';
import {selectIsLoading} from 'reducers';
import {PATHS} from "config";
import {goTo} from "utils/history";

import reducer, {selectAdmin} from 'admin/reducer';
import fetchUsersSaga from 'admin/sagas/fetchUsers';
import deleteUserSaga from 'admin/sagas/deleteUser';
import {fetchUsers, deleteUser} from 'admin/actions';
import RoleTag from 'admin/pages/ManageUsers/roleTag';
import './style.scss';


const key = 'admin';


export default function ManageUser(props) {
  const dispatch = useDispatch();

  const userID = props.match.params.userID;
  const adminState = useSelector(selectAdmin);
  const user = _.get(adminState.users, userID, {
    "name": "",
    "email": "",
    "role": "",
  });
  const isLoading = useSelector(selectIsLoading);

  useInjectReducer({ key: key, reducer: reducer });
  useInjectMultipleSagas({ key: key, sagas: [fetchUsersSaga, deleteUserSaga] });

  useEffect(() => {
    if (adminState.stale || !_.has(adminState.users, userID)) {
      dispatch(fetchUsers.request());
    }
  }, []);

  return (
    <PageContent>
      <Spin tip="Loading..." spinning={isLoading}>
        <PageHeader
          style={{
            border: '1px solid rgb(235, 237, 240)',
          }}
          title={user.name}
          subTitle="Manage user"
          onBack={goTo(PATHS.ManageUsers)}
        />
        <Descriptions title="" column={1} bordered style={{margin: "25px 5px"}}>
          <Descriptions.Item label="Name">{user.name}</Descriptions.Item>
          <Descriptions.Item label="Email">
            <a href={`mailto:${user.email}`}>{user.email}</a>
          </Descriptions.Item>
          <Descriptions.Item label="Role">
            <RoleTag role={user.role} />
          </Descriptions.Item>
        </Descriptions>
        <Popconfirm
          title="Are you sure delete this user? This cannot be undone."
          placement="bottom"
          onConfirm={() => dispatch(deleteUser.request({userID, name: user.name}))}
          onCancel={() => null}
          okText="Yes"
          okType="danger"
          cancelText="No"
          icon={<Icon type="question-circle-o" style={{ color: 'red' }} />}
        >
          <Button type="danger">Delete</Button>
        </Popconfirm>
      </Spin>
    </PageContent>
  )
}
