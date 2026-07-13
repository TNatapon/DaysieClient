import axios from "axios";
import React, { useState } from "react";
import { Form, Input, Button, Typography, Row, Col, Card, message } from "antd";
import { useNavigate } from "react-router-dom";

const { Title, Paragraph, Link } = Typography;

const DeviceTokenPage = () => {
  const navigate = useNavigate();
  const [token, setToken] = useState("");

  const handleConnectDevice = async ({ token }) => {
    try {
      const { data, status } = await axios.get(
        `https://dev.daysie.io/device/${token}`,
        {
          withCredentials: true,
        }
      );

      if (status === 200) {
        localStorage.setItem("device", JSON.stringify(data));
        navigate("/overview");
        return message.success("Connect success");
      }

      console.error("Unexpected status code:", status);
    } catch (err) {
      console.error("Error connecting device:", err);
      message.error("Failed to connect device. Please check your token.");
    }
  };

  return (
    <Row justify="start" style={{ padding: "20px" }}>
      <Col span={24}>
        <Card>
          <Title level={2}>Device Token</Title>
          <Paragraph>
            Please enter your device token to connect your device. If you don't
            have a token, follow the guide below to obtain one.
          </Paragraph>
          <Paragraph>
            <b>How to get your device token:</b>
            <br />
            1. Go to the{" "}
            <Link href="https://portal.daysie.io" target="_blank">
              portal
            </Link>
            .<br />
            2. Open the device page.
            <br />
            3. Copy your device token.
          </Paragraph>
        </Card>
        <Card style={{ marginTop: "20px" }}>
          <Form
            onFinish={handleConnectDevice}
            layout="inline"
            requiredMark={false}
          >
            <Form.Item
              name="token"
              label="Token"
              rules={[
                { required: true, message: "Please enter your device token!" },
              ]}
            >
              <Input
                placeholder="Enter your device token"
                style={{ width: "300px" }}
                value={token}
                onChange={(e) => setToken(e.target.value)}
              />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Connect
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </Col>
    </Row>
  );
};

export default DeviceTokenPage;
