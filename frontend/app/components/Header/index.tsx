import React from 'react';
import {useSelector} from 'react-redux';
import {Col, Row} from 'antd';

import {SITE_NAME} from 'config';
// import {ROUTES} from 'routes';
import {selectIsAuthenticated, selectIsAdmin} from 'security/reducer';
import A from 'components/A';
import {PATHS} from 'config';
import {Tag} from 'antd';

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
            {isAdmin && <a><Tag color="red">Admin</Tag></a>}
            <A route={PATHS.Logout}>Logout</A>
          </div> : <div>
            <A route={PATHS.SignUp}>Sign Up</A>
            <A route={PATHS.Login}>Login</A>
          </div>}
        </Col>
      </Row>
    </div>
  );
}
