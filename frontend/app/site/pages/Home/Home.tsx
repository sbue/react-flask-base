/*
 * HomePage
 *
 * This is the first thing users see of our App, at the '/' route
 *
 * NOTE: while this component should technically be a stateless functional
 * component (SFC), hot reloading does not currently support SFCs. If hot
 * reloading is not a necessity for you then you can refactor it and remove
 * the linting exception.
 */

import React from 'react';
import { PageHeader, Skeleton } from 'antd';

import { useSelector } from 'react-redux';
import { selectSecurity } from 'security/reducer';


export default function HomePage() {
  const security = useSelector(selectSecurity);
  const userGreeting = security.user.firstName ? security.user.firstName : '🌍';
  return (
    <div>
      <PageHeader
        style={{
          border: '1px solid rgb(235, 237, 240)',
        }}
        title={`Howdy ${userGreeting}`}
        subTitle="Welcome to our application"
      />
      <Skeleton />
      <Skeleton />
      <Skeleton />
    </div>
  );
}
