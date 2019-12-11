import React from 'react';
import {Tag, Icon} from 'antd';
import {RoleTag, VerifiedEmailIcon} from './Tags';

import A from 'components/A';
import {PATHS} from 'config';

const center: 'center' = 'center';  // hack to fix typing issue
export const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    // sorter: (a, b) => a.name.localeCompare(b.name),
    // sortDirections: ['descend', 'ascend'],
    render: (name, record) => {
      const params = {userID: record['key'].toString()};
      return (<A route={PATHS.ManageUser} params={params}>{name}</A>);
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
    // align: 'center',
    // sorter: (a, b) => a.role.localeCompare(b.role),
    // sortDirections: ['descend', 'ascend'],
    render: (role: string) => (
      <RoleTag role={role} />
    ),
  },
  {
    title: 'Verified Email',
    dataIndex: 'verifiedEmail',
    // align: center,
    // sorter: (a, b) => a.role.localeCompare(b.role),
    // sortDirections: ['descend', 'ascend'],
    render: (verifiedEmail: boolean) => (
      <VerifiedEmailIcon verifiedEmail={verifiedEmail} />
    ),
  },
];
