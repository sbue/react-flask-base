import React from 'react';
import {useSelector} from 'react-redux';
import {Col, Row, Tag} from 'antd';

import {SITE_NAME, PATHS} from 'config';
import {selectIsAuthenticated, selectIsAdmin} from 'security/reducer';
import A from 'components/A';

import icon from 'images/icon-512x512.png';
import './style.scss';


export default function Header() {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isAdmin = useSelector(selectIsAdmin);
  return (
    <div id="header">
      <Row>
        <Col id="logo" xs={24} sm={24} md={7} lg={7} xl={7} xxl={6}>
          <A route={PATHS.Home}>
            <img src={icon} height="32px" />
            <h5>{SITE_NAME}</h5>
          </A>
        </Col>
        <Col id="menu" xs={0} sm={0} md={17} lg={17} xl={17} xxl={18}>
          {isAuthenticated ? <div>
            {isAdmin && <span>
              <Tag color="red">Admin</Tag>
            </span>}
            <A route={PATHS.Logout}>Logout</A>
            <A route={PATHS.Settings}>Settings</A>
            {isAdmin && <A route={PATHS.AdminDashboard}>Dashboard</A>}
          </div> : <div>
            <A route={PATHS.SignUp}>Sign Up</A>
            <A route={PATHS.Login}>Login</A>
          </div>}
        </Col>
      </Row>
    </div>
  );
}
