import React, { useState, useEffect, useMemo } from "react";
import {
  Card,
  Row,
  Col,
  Switch,
  Divider,
  Badge,
  Space,
  Typography,
} from "antd";
import axios from "axios";
import { LinkOutlined } from "@ant-design/icons";
import styled from "styled-components";
import { Link } from "react-router-dom";

const { Text } = Typography;

const StatusBadge = styled(Badge)`
  // margin-left: 4px;
  // margin-bottom: 2px;
`;

const Label = styled.span`
  font-weight: bold;
  margin-right: 4px;
`;

const LabelCol = { xs: 8, sm: 6, md: 5 };

const RecipeConfigPage = () => {
  const [dbSwitch, setDbSwitch] = useState(false);
  const [viSwitch, setViSwitch] = useState(false);
  const [serverConnected, setServerConnected] = useState(false);
  const [recipeId, setRecipeId] = useState("");

  // Memoized hostname
  const hostname = useMemo(() => window.location.hostname, []);

  // Fetch server health and device info on mount
  useEffect(() => {
    // Check server connection status
    axios
      .get(`http://${hostname}:8080/health`)
      .then((res) => {
        if (res.status === 200) {
          setServerConnected(true);
        } else {
          setServerConnected(false);
        }
      })
      .catch((err) => {
        console.error("Failed to connect to server:", err);
        setServerConnected(false);
      });

    // Retrieve device info
    const deviceInfo = JSON.parse(localStorage.getItem("device")) || {};
    setRecipeId(deviceInfo.recipeid || "");
  }, [hostname]);

  // Handlers for DB and Visualization switches
  const handleDBSwitchChange = (checked) => {
    const action = checked ? "start" : "stop";
    axios
      .get(`http://${hostname}:8080/db/${action}`)
      .then((res) => {
        if (res.status === 200) {
          alert(checked ? "Database started!!!" : "Database stopped!!!");
          setDbSwitch(checked);
        } else {
          console.log("Unexpected status code:", res.status);
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const handleVISwitchChange = (checked) => {
    const action = checked ? "start" : "stop";
    axios
      .get(`http://${hostname}:8080/dashboard/${action}`)
      .then((res) => {
        if (res.status === 200) {
          alert(
            checked ? "Visualization started!!!" : "Visualization stopped!!!"
          );
          setViSwitch(checked);
        } else {
          console.log("Unexpected status code:", res.status);
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <div style={{ padding: 20 }}>
      <Card title="Recipe configuration">
        <Row gutter={[20, 10]}>
          <Col span={24}>
            <Space direction="vertical" style={{ width: "100%" }}>
              <Row>
                <Col {...LabelCol}>
                  <Label style={{ marginRight: 8 }}>Recipe ID:</Label>{" "}
                </Col>
                <Text copyable>{recipeId || "N/A"}</Text>
              </Row>
              <Row>
                <Col {...LabelCol}>
                  <Label style={{ marginRight: 8 }}>Server:</Label>
                </Col>
                <StatusBadge
                  count={serverConnected ? "Connected" : "Disconnected"}
                  style={{
                    backgroundColor: serverConnected ? "#52c41a" : "#f5222d",
                  }}
                />
              </Row>
            </Space>
          </Col>
          <Divider type="horizontal" style={{ width: "100%", margin: 0 }} />
          <Col span={24}>
            <Space direction="vertical" style={{ width: "100%" }}>
              <SwitchRow
                label="Database"
                checked={dbSwitch}
                onChange={handleDBSwitchChange}
                linkUrl={`http://${hostname}:8086`}
                linkText="InfluxDB"
              />
              <SwitchRow
                label="Visualization"
                checked={viSwitch}
                onChange={handleVISwitchChange}
                linkUrl={`http://${hostname}:3000`}
                linkText="Grafana"
              />
              <Row style={{ width: "100%" }}>
                <Col {...LabelCol}>
                  <Label style={{ marginRight: 8 }}>ML-Box ID:</Label>
                </Col>{" "}
                <Text copyable>N/A</Text>
              </Row>
            </Space>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

// Helper component for Switch + Link combination
const SwitchRow = ({ label, checked, onChange, linkUrl, linkText }) => (
  <Row>
    <Col {...LabelCol}>
      <Label style={{ marginRight: 8 }}>{label}:</Label>
    </Col>
    <Switch
      checked={checked}
      onChange={onChange}
      checkedChildren="Yes"
      unCheckedChildren="No"
    />
    <Link
      to={linkUrl}
      target="_blank"
      rel="noopener noreferrer"
      style={{ marginLeft: 8 }}
    >
      {linkText}
      <LinkOutlined style={{ marginLeft: 8 }} />
    </Link>
  </Row>
);

export default RecipeConfigPage;
