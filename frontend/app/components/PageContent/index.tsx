import React, { ReactNode } from 'react';
import { Row, Col } from 'antd';

interface PageContentProps {
  children: ReactNode;
}

export default function PageContent(props: PageContentProps) {
  return (
    <div>
      <Row type="flex" justify="center">
        <Col xs={22} sm={22} md={20} lg={9} xl={9} className="content-column">
          {/* Flash */}
          {props.children}
        </Col>
      </Row>
    </div>
  );
}
