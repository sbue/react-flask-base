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
import {PageHeader, Skeleton} from 'antd';

import {useSelector} from 'react-redux';
import {selectFirstName} from 'security/reducer';
import PageContent from 'components/PageContent';

export default function HomePage() {
  const security = useSelector(selectFirstName);
  const userGreeting = security.firstName ? security.firstName : '🌍';

  return (
    <PageContent>
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
    </PageContent>
  );
}
