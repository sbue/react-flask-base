import React, {ReactNode} from 'react';
import {goTo} from 'utils/history';

interface AProps {
  route: string;
  children: ReactNode;
  params?: object,
  [x: string]: any
}

export default function A(props: AProps) {
  const onClick = goTo(props.route, props.params);
  return (
    <a onClick={onClick} {...props} >
      {props.children}
    </a>
  );
}
