import React from 'react';
import { Row, Col } from 'antd';
import icon from 'images/icon-512x512.png';
import './style.scss';
import { SITE_NAME } from 'config';

import { useSelector } from 'react-redux';
import { selectIsAuthenticated } from 'security/reducer';


export default function Header() {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  return (
    <div id="header">
      <Row>
        <Col id="logo" xs={24} sm={24} md={7} lg={7} xl={7} xxl={6}>
          <a href="/">
            <img src={icon} height="32px" />
            <h5>{SITE_NAME}</h5>
          </a>
        </Col>
        <Col id="menu" xs={0} sm={0} md={17} lg={17} xl={17} xxl={18}>
          {isAuthenticated ? <div>
            <a href="/logout">Logout</a>
          </div> : <div>
            <a href="/sign-up">Sign Up</a>
            <a href="/login">Login</a>
          </div>}
        </Col>
      </Row>
    </div>
  );
}
