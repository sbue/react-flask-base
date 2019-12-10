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
        subTitle="Welcome to our application. Lets see if we're caching."
      />
      <Skeleton />
      <Skeleton />
      <Skeleton />
    </PageContent>
  );
}
