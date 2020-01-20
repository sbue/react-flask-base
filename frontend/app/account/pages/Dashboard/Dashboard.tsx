import React from 'react';
import {Card, Col, Icon, PageHeader, Row} from 'antd';

import {useInjectAdminReducer} from 'utils/injectReducer';
import {useInjectSaga} from 'utils/injectSaga';
import saga from 'admin/sagas/fetchUsers';
import A from 'components/A';
import PageContent from 'components/PageContent';
import {PATHS} from 'config';

const {Meta} = Card;

export default function Dashboard() {

  useInjectAdminReducer();
  useInjectSaga({ key: 'UserDashboard', saga: saga });

  return (
    <PageContent>
      <PageHeader
        style={{
          border: '1px solid rgb(235, 237, 240)',
        }}
        title="User Dashboard"
        subTitle=""
      />
      <Row type="flex" justify="start">
        <Col xs={24} sm={22} md={12} lg={12} xl={12} xxl={12}>
          <A route={PATHS.UserDashboard}>
            <Card style={{ margin: '10px' }}>
              <Meta
                avatar={<Icon type="control" style={{ fontSize: '32px', color: '#08c' }} />}
                title="User Feature"
                description="Give me a description"
              />
            </Card>
          </A>
        </Col>
      </Row>
    </PageContent>
  );
}
