/*
 * Logout
 *
 * This is the logout component
 */

import React, {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {PageHeader, Table} from 'antd';

import { useInjectReducer } from 'utils/injectReducer';
import { useInjectSaga } from 'utils/injectSaga';
import reducer, {selectUsers} from 'admin/reducer';
import saga from 'admin/sagas/fetchUsers';
import PageContent from 'components/PageContent';

import {fetchUsers} from 'admin/actions';

const key = 'admin';

const columns = [{
    title: 'First Name',
    dataIndex: 'firstName',
  },
  {
    title: 'Last Name',
    dataIndex: 'lastName',
  },
  {
    title: 'Email',
    dataIndex: 'email',
  },
  {
    title: 'Role',
    dataIndex: 'role',
  }
];

export default function Dashboard() {
  const dispatch = useDispatch();
  const users = useSelector(selectUsers);

  useInjectReducer({ key: key, reducer: reducer });
  useInjectSaga({ key: key, saga: saga });

  useEffect(() => {
    dispatch(fetchUsers.request())
  }, []);

  return (
    <PageContent>
      <PageHeader
        style={{
          border: '1px solid rgb(235, 237, 240)',
          marginBottom: "20px",
        }}
        title="Manage Users"
        subTitle="View and manage registered users"
      />
      <Table dataSource={users} columns={columns} />
    </PageContent>)
}
