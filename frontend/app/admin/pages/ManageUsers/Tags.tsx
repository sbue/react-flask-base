import React from 'react';
import {Tag, Icon} from 'antd';

export function RoleTag(props) {
  return (
    <Tag color={props.role === 'User' ? 'blue' : 'purple'}>{props.role}</Tag>
  );
}

export function VerifiedEmailIcon(props) {
  const iconType = props.verifiedEmail ? 'check-square' : 'close-square';
  const twoToneColor = props.verifiedEmail ? '#52C41A' : '#F83F22';
  return (
    <Icon type={iconType}
          theme="twoTone"
          twoToneColor={twoToneColor}
          style={{fontSize: '18px'}}
    />
  );
}
