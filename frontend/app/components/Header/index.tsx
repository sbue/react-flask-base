import React from 'react';
import {useSelector} from 'react-redux';
import {Col, Row} from 'antd';

import {SITE_NAME} from 'config';
// import {ROUTES} from 'routes';
import {selectIsAuthenticated} from 'security/reducer';
import A from 'components/A';

import icon from 'images/icon-512x512.png';
import './style.scss';


export default function Header() {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  return (
    <div id="header">
      <Row>
        <Col id="logo" xs={24} sm={24} md={7} lg={7} xl={7} xxl={6}>
          <A route={'/'}>
            <img src={icon} height="32px" />
            <h5>{SITE_NAME}</h5>
          </A>
        </Col>
        <Col id="menu" xs={0} sm={0} md={17} lg={17} xl={17} xxl={18}>
          {isAuthenticated ? <div>
            <A route={'/logout'}>Logout</A>
          </div> : <div>
            <A route={'/sign-up'}>Sign Up</A>
            <A route={'/login'}>Login</A>
          </div>}
        </Col>
      </Row>
    </div>
  );
}
