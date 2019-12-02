/**
 * NotFoundPage
 *
 * This is the page we show when the user visits a url that doesn't have a route
 */

import React from 'react';
import {PageHeader, Skeleton} from 'antd';

import PageContent from 'components/PageContent';

export default function NotFound() {
  return (
    <PageContent>
      <PageHeader
        style={{
          border: '1px solid rgb(235, 237, 240)',
        }}
        title={`404 Page Not Found`}
        subTitle=""
      />
      <Skeleton />
      <Skeleton />
      <Skeleton />
    </PageContent>
  );
}
