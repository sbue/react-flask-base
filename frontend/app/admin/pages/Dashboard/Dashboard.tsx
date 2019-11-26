/*
 * Logout
 *
 * This is the logout component
 */

import React from 'react';
import {Card, Col, Icon, PageHeader, Row} from 'antd';

import {useInjectReducer} from 'utils/injectReducer';
import {useInjectSaga} from 'utils/injectSaga';
import reducer from 'admin/reducer';
import saga from 'admin/sagas/fetchUsers';
import A from 'components/A';
import PageContent from 'components/PageContent';
import {PATHS} from 'config';

const { Meta } = Card;

const key = 'admin';

export default function Dashboard() {

  useInjectReducer({ key: key, reducer: reducer });
  useInjectSaga({ key: key, saga: saga });

  return (
    <PageContent>
      <PageHeader
        style={{
          border: '1px solid rgb(235, 237, 240)',
        }}
        title="Admin Dashboard"
        subTitle=""
      />
      <Row type="flex" justify="start">
        <Col xs={24} sm={22} md={12} lg={12} xl={12} xxl={12}>
          <A route={PATHS.ManageUsers}>
            <Card style={{ margin: "10px" }}>
              <Meta
                avatar={<Icon type="team" style={{ fontSize: '32px', color: '#08c' }} />}
                title="Manage Users"
                description="View and manage user accounts"
              />
            </Card>
          </A>
        </Col>
        <Col xs={24} sm={22} md={12} lg={12} xl={12} xxl={12}>
          <A route={PATHS.Home}>
            <Card style={{ margin: "10px" }}>
              <Meta
                avatar={<Icon type="user-add" style={{ fontSize: '32px', color: '#08c' }} />}
                title="Add New User"
                description="Create a new user account"
              />
            </Card>
          </A>
        </Col>
        <Col xs={24} sm={22} md={12} lg={12} xl={12} xxl={12}>
          <A route={PATHS.Home}>
            <Card style={{ margin: "10px" }}>
              <Meta
                avatar={<Icon type="user-add" style={{ fontSize: '32px', color: '#08c' }} />}
                title="Invite New User "
                description="Invite a new user by email"
              />
            </Card>
          </A>
        </Col>
        <Col xs={24} sm={22} md={12} lg={12} xl={12} xxl={12}>
          <A route={PATHS.Home}>
            <Card style={{ margin: "10px" }}>
              <Meta
                avatar={<Icon type="user-add" style={{ fontSize: '32px', color: '#08c' }} />}
                title="Create Invitation Link"
                description="Create sign-up link"
              />
            </Card>
          </A>
        </Col>
      </Row>
    </PageContent>)
}
