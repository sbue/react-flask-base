import React, {ReactNode} from 'react';
import {goTo} from 'utils/history';
import {compile} from 'path-to-regexp';

interface AProps {
  route: string;
  children: ReactNode;
  params?: object;
  [x: string]: any;
}

export default function A(props: AProps) {
  const onClick = (evt) => {
    if (evt !== undefined && evt.preventDefault) {
      evt.preventDefault();
    }
    goTo(props.route, props.params)();
  };
  return (
    <a href={compile(props.route)(props.params)} onClick={onClick} {...props} >
      {props.children}
    </a>
  );
}
