import React from "react";
import { Button, Card, Row, message } from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const hostname = window.location.hostname;

const AdvancedSettingPage = () => {
  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      const res = await axios.get(`http://${hostname}:8080/reset`);
      if (res.status === 200) {
        message.success("Reset!!!");
        localStorage.setItem("device", JSON.stringify(res.data));
        navigate("/overview");
      } else {
        console.log("Unexpected status code:", res.status);
      }
    } catch (err) {
      console.error(err);
      message.error("Failed to reset device.");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <Card title="Advanced settings">
        <Row justify={"space-between"} align={"middle"}>
          <span>Clear all data in device</span>
          <Button onClick={handleSubmit} type="primary" danger>
            Reset
          </Button>
        </Row>
      </Card>
    </div>
  );
};

export default AdvancedSettingPage;
