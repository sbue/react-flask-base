import React from 'react';
import {Tag, Icon, Avatar} from 'antd';
import {SortOrder, ColumnProps} from 'antd/lib/table/interface'
import {RoleTag, VerifiedEmailIcon} from './Tags';

import A from 'components/A';
import {PATHS} from 'config';


export const columns = [
  {
    title: 'Profile Photo',
    dataIndex: 'profilePhotoUrl',
    width: '15%',
    align: 'center' as ColumnProps<any>['align'],
    render: (profilePhotoUrl) => {
      const props = profilePhotoUrl ? {src: profilePhotoUrl} : {icon: 'user'};
      return <Avatar {...props} size={48} />;
    },
  },
  {
    title: 'Name',
    dataIndex: 'name',
    sorter: (a, b) => a.name.localeCompare(b.name),
    sortDirections: ['descend', 'ascend'] as SortOrder[],
    render: (name, record) => {
      const params = {userID: record['key'].toString()};
      return (<A route={PATHS.ManageUser} params={params}>{name}</A>);
    },
  },
  {
    title: 'Email',
    dataIndex: 'email',
    sorter: (a, b) => a.email.localeCompare(b.email),
    sortDirections: ['descend', 'ascend'] as SortOrder[],
  },
  {
    title: 'Role',
    dataIndex: 'role',
    width: '15%',
    align: 'center' as ColumnProps<any>['align'],
    sorter: (a, b) => a.role.localeCompare(b.role),
    sortDirections: ['descend', 'ascend'] as SortOrder[],
    render: (role: string) => (
      <RoleTag role={role} />
    ),
  },
  {
    title: 'Verified Email',
    dataIndex: 'verifiedEmail',
    width: '15%',
    align: 'center' as ColumnProps<any>['align'],
    // align: center,
    // sorter: (a, b) => a.role.localeCompare(b.role),
    // sortDirections: ['descend', 'ascend'],
    render: (verifiedEmail: boolean) => (
      <VerifiedEmailIcon verifiedEmail={verifiedEmail} />
    ),
  },
];
