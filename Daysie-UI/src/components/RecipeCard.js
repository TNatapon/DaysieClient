import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  Card,
  Button,
  Badge,
  message,
  Tag,
  Tooltip,
  Space,
  Row,
  Col,
  Typography,
  Grid,
  Divider,
} from "antd";
import { Link } from "react-router-dom";
import { ControlOutlined } from "@ant-design/icons";
import styled from "styled-components";
import dayjs from "dayjs";

const { Text } = Typography;
const { useBreakpoint } = Grid;

const StatusBadge = styled(Badge)`
  margin-left: 4px;
  margin-bottom: 2px;

  sup {
    color: #1a1a1a !important;
  }
`;

const UpdatedAtText = styled.div`
  color: #595959;
  font-size: 10px;
  font-weight: 400;
`;

const Label = styled.span`
  font-weight: bold;
  margin-right: 4px;
`;

const getBadgeColor = (status) => {
  switch (status) {
    case "Up to date":
    case "Connected":
    case "Yes":
      return "#52c41a";
    case "Obsolete":
      return "#faad14";
    case "Removed":
    case "Disconnected":
    case "No":
      return "#f5222d";
    default:
      return "#d9d9d9";
  }
};

const RecipeDetails = ({ values, status }) => (
  <Row gutter={[20, 10]}>
    <Col
      xs={24}
      md={12}
      style={{ borderRight: useBreakpoint().md ? "1px solid #d9d9d9" : "" }}
    >
      <Space direction="vertical">
        <div>
          <Label>Recipe ID:</Label> <Text copyable>{values.recipeId}</Text>
        </div>
        <div>
          <Label>Server:</Label>
          <StatusBadge
            count={values.connection}
            style={{ backgroundColor: getBadgeColor(values.connection) }}
          />
        </div>
      </Space>
    </Col>
    {useBreakpoint().md ? null : (
      <Divider type="horizontal" style={{ width: "100%", margin: 0 }} />
    )}
    <Col xs={24} md={12}>
      <Space direction="vertical">
        <div>
          <Label>Database:</Label>
          <StatusBadge
            count={values.database}
            style={{ backgroundColor: getBadgeColor(values.database) }}
          />
        </div>
        <div>
          <Label>Visualization:</Label>
          <StatusBadge
            count={values.visualization}
            style={{ backgroundColor: getBadgeColor(values.visualization) }}
          />
        </div>
        <div>
          <Label>Protocol:</Label>
          {values.protocol.split(",").map((protocol) => (
            <Tag key={protocol}>{protocol}</Tag>
          ))}
        </div>
        <div>
          <Label>ML-Box ID:</Label> <Text copyable>{values.mlboxId}</Text>
        </div>
      </Space>
    </Col>
  </Row>
);

const RecipeCard = () => {
  const [status, setStatus] = useState("Up to date");
  const [values, setValues] = useState({
    recipeId: "",
    connection: "",
    database: "",
    visualization: "",
    protocol: "",
    mlboxId: "",
    updatedAt: "",
  });

  const fetchData = async (recipeId) => {
    try {
      const response = await axios.get(
        `https://dev.daysie.io/recipe/${recipeId}`,
        { withCredentials: true }
      );
      const recipeData = response.data;

      if (recipeData.mlbox) {
        await axios.get(
          `http://${window.location.hostname}:8080/model/${recipeData.mlbox}`,
          { withCredentials: true }
        );
      }

      setValues({
        recipeId: recipeData.recipeid || "N/A",
        connection: recipeData.status ? "Connected" : "Disconnected",
        database: recipeData.database ? "Yes" : "No",
        visualization: recipeData.visualization ? "Yes" : "No",
        protocol: recipeData.protocol || "N/A",
        mlboxId: recipeData.mlbox || "N/A",
        updatedAt: recipeData.UpdatedAt || "N/A",
      });

      setStatus(recipeData.version === "latest" ? "Up to date" : "Obsolete");
    } catch (error) {
      console.error("Error fetching recipe data", error);
      setStatus("Removed");
    }
  };

  useEffect(() => {
    const deviceInfo = JSON.parse(localStorage.getItem("device"));
    if (deviceInfo) {
      fetchData(deviceInfo.recipeid);
    } else {
      setStatus("Removed");
    }
  }, []);

  const updateRecipe = async (event) => {
    event.preventDefault();
    try {
      const res = await axios.get(
        `http://${window.location.hostname}:8080/stop`
      );
      if (res.status === 200) {
        message.success("Updating");
        localStorage.setItem("device", JSON.stringify(res.data));
      } else {
        console.error("Unexpected status code:", res.status);
      }
    } catch (error) {
      console.error("Error updating recipe", error);
    }
  };

  return (
    <Card
      title={
        <div>
          Recipe
          <StatusBadge
            style={{ backgroundColor: getBadgeColor(status) }}
            count={status}
          />
          {values.updatedAt && (
            <UpdatedAtText>
              {dayjs(values.updatedAt).format("DD MMM YYYY, HH:mm:ss")}
            </UpdatedAtText>
          )}
        </div>
      }
      extra={
        <Tooltip title="Configure">
          <Link to="/configure">
            <Button type="secondary" icon={<ControlOutlined />} />
          </Link>
        </Tooltip>
      }
      style={{ width: "100%" }}
    >
      <div className={status === "Removed" ? "text-center" : ""}>
        {status === "Removed" ? (
          <>
            <p>Sorry, something went wrong.</p>
            <p>The recipe has been deleted and is no longer in service.</p>
            <Button type="link">Link</Button>
            <p>Please download your recipe.</p>
          </>
        ) : (
          <RecipeDetails values={values} status={status} />
        )}
      </div>
      {status === "Obsolete" && (
        <Button type="primary" onClick={updateRecipe}>
          Update
        </Button>
      )}
    </Card>
  );
};

export default RecipeCard;
