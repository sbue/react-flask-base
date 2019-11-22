import React, {ReactNode} from 'react';
// import {ROUTES, getPath} from 'routes';
import {goTo} from 'utils/history';

interface AProps {
  route: string;
  children: ReactNode;
}

export default function A(props: AProps) {
  return (
    <a onClick={goTo(props.route)} {...props} >
      {props.children}
    </a>
  );
}
