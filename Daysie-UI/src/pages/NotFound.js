// NotFoundPage.js
import React from "react";
import { Result, Button, Row, Col } from "antd";
import { Link } from "react-router-dom";

const NotFoundPage = () => (
  <Row justify="center" align="middle" style={{ minHeight: "100vh" }}>
    <Col span={24}>
      <Result
        status="404"
        title="404"
        subTitle="Sorry, the page you visited does not exist."
        extra={
          <Button type="primary">
            <Link to="/overview">Back Home</Link>
          </Button>
        }
      />
    </Col>
  </Row>
);

export default NotFoundPage;
