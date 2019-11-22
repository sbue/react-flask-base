import React from 'react';
import { Row, Col, Divider } from 'antd';
import { COPYRIGHT } from 'config';


export default function Footer() {
  return (
    <div id="footer">
      <Row type="flex" justify="center">
        <Col xs={18} sm={18} md={10} lg={10} xl={10} xxl={8}>
          <Divider />
          Copyright {new Date().getFullYear()} {COPYRIGHT}
        </Col>
      </Row>
    </div>
  );
}
