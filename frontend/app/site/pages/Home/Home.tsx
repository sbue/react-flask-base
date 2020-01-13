import React from 'react';
import {PageHeader, Skeleton} from 'antd';

import {useSelector} from 'react-redux';
import {selectFirstName} from 'account/reducer';
import PageContent from 'components/PageContent';

export default function HomePage() {
  const firstName = useSelector(selectFirstName);
  const userGreeting = firstName ? firstName : '🌍';

  return (
    <PageContent>
      <PageHeader
        style={{
          border: '1px solid rgb(235, 237, 240)',
        }}
        title={`Howdy ${userGreeting}`}
        subTitle="Welcome to our application."
      />
      <Skeleton />
      <Skeleton />
      <Skeleton />
    </PageContent>
  );
}
