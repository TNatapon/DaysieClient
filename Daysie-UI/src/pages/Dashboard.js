import React from "react";
import { Card, Button, Progress, Row, Col, Tooltip, Space } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { SettingOutlined, EditOutlined } from "@ant-design/icons";
import RecipeCard from "../components/RecipeCard";

const DashboardProgress = React.memo(({ percent, strokeColor, label }) => (
  <Progress
    percent={percent}
    type="dashboard"
    strokeColor={strokeColor}
    strokeWidth={8}
    size={160}
    aria-label={`${label} progress: ${percent}%`}
    format={(percentage) => (
      <div>
        <h3>{percentage}%</h3>
        <p style={{ fontSize: 16 }}>{label}</p>
      </div>
    )}
  />
));

const ActionButtons = React.memo(({ onEditClick }) => (
  <Space>
    <Tooltip title="Advance settings">
      <Link to="/advancedSetting">
        <Button type="secondary" icon={<SettingOutlined />} />
      </Link>
    </Tooltip>
    <Tooltip title="Change device">
      <Button type="secondary" icon={<EditOutlined />} onClick={onEditClick} />
    </Tooltip>
  </Space>
));

const DashboardPage = () => {
  const navigate = useNavigate();

  const navigateToToken = () => navigate("/deviceToken");

  // const exp = localStorage.getItem("exp");
  // const expires = useMemo(() => new Date(exp), [exp]);

  return (
    <div style={{ padding: 20 }}>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <RecipeCard />
        </Col>
        <Col span={24}>
          <Card
            title="Device"
            extra={<ActionButtons onEditClick={navigateToToken} />}
            style={{ width: "100%" }}
          >
            <Row gutter={[16, 16]} style={{ textAlign: "center" }}>
              <Col xs={24} md={8}>
                <DashboardProgress
                  percent={60}
                  strokeColor="#3F73F4"
                  label="Usage"
                />
              </Col>
              <Col xs={24} md={8}>
                <DashboardProgress
                  percent={80}
                  strokeColor="#F47F3F"
                  label="CPU"
                />
              </Col>
              <Col xs={24} md={8}>
                <DashboardProgress
                  percent={40}
                  strokeColor="#3FF4B2"
                  label="Memory"
                />
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default DashboardPage;
