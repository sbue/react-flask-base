import React from 'react';
import { Row, Col } from 'antd';
import { COPYRIGHT } from 'config';


export default function Header() {
  return (
    <div id="header">
      <Row>
        <Col xs={24} sm={24} md={10} lg={10} xl={10} xxl={8}>
          Copyright {new Date().getFullYear()} {COPYRIGHT}
        </Col>
      </Row>
    </div>
  );
}
