import React from 'react';
import {Tag} from 'antd';

export default function RoleTag(props) {
  return (
    <Tag color={props.role === 'User' ? 'blue' : 'red'}>{props.role}</Tag>
  )
}
