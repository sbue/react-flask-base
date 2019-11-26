import React from 'react';
import {Tag} from 'antd';
import RoleTag from './roleTag';

import A from 'components/A';
import {PATHS} from 'config';

export const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    // sorter: (a, b) => a.name.localeCompare(b.name),
    // sortDirections: ['descend', 'ascend'],
    render: (name, record) => {
      const params = {userID: record["key"].toString()};
      return (<A route={PATHS.ManageUser} params={params}>{name}</A>)
    },
  },
  {
    title: 'Email',
    dataIndex: 'email',
    // sorter: (a, b) => a.email.localeCompare(b.email),
    // sortDirections: ['descend', 'ascend'],
  },
  {
    title: 'Role',
    dataIndex: 'role',
    // sorter: (a, b) => a.role.localeCompare(b.role),
    // sortDirections: ['descend', 'ascend'],
    render: (role: string) => (
      <RoleTag role={role} />
    ),
  }
];
