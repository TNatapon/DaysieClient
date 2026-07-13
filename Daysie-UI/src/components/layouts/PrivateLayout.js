import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Layout, Menu, Tooltip } from "antd";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  CaretLeftOutlined,
  CaretRightOutlined,
  PhoneOutlined,
  LogoutOutlined,
  GlobalOutlined,
  SettingOutlined,
  FundOutlined,
  ControlOutlined,
  PartitionOutlined,
} from "@ant-design/icons";
import logo from "../../assets/logo.png";
import textLogo from "../../assets/logo-with-text.png";

const { Sider, Content, Footer } = Layout;

const CollapseMenuFrame = styled.div`
  position: fixed;
  z-index: 1;
  left: ${(props) => (props.collapsed ? "69px" : "229px")};
  top: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  border-radius: 8px;
  background-color: #fff;
  transition: left 0.2s;
`;

const LogoContainer = styled.div`
  display: flex;
  justify-content: ${(props) => (props.collapsed ? "center" : "start")};
  align-items: center;
  height: 32px;
  margin: 16px;
`;

const LogoImage = styled.img`
  max-width: ${(props) => (props.collapsed ? "32px" : "120px")};
  max-height: 35px;
`;

const MainLayout = styled(Layout)`
  margin-left: ${(props) => (props.collapsed ? "80px" : "240px")};
  transition: margin-left 0.2s;
  background-color: var(--background-color);
`;

const ContentBackground = styled.div`
  min-height: 360px;
`;

const MenuContainer = styled.div`
  height: calc(100% - 64px);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const PrivateLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const device = localStorage.getItem("device");
  const navigate = useNavigate();

  useEffect(() => {
    if (!device) navigate("/deviceToken");
  }, [device, navigate]);

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const menuItems = [
    {
      key: "/overview",
      icon: <FundOutlined />,
      label: <Link to="/overview">Overview</Link>,
      disabled: !device,
      style: { pointerEvents: device ? "auto" : "none" },
    },
    {
      key: "/configure",
      icon: <ControlOutlined />,
      label: <Link to="/configure">Recipe Configuration</Link>,
      disabled: !device,
      style: { pointerEvents: device ? "auto" : "none" },
    },
    {
      key: "/advancedSetting",
      icon: <SettingOutlined />,
      label: <Link to="/advancedSetting">Advanced Settings</Link>,
      disabled: !device,
      style: { pointerEvents: device ? "auto" : "none" },
    },
    {
      key: "/flowEditor",
      icon: <PartitionOutlined />,
      label: <Link to="/flowEditor">Flow</Link>,
      disabled: !device,
      style: { pointerEvents: device ? "auto" : "none" },
    },
  ];
  const bottomMenuItems = [
    {
      key: "portal",
      icon: <GlobalOutlined />,
      label: (
        <Link
          to="https://portal.daysie.io"
          target="_blank"
          rel="noopener noreferrer"
        >
          Go to Portal
        </Link>
      ),
    },
    {
      key: "/contact",
      icon: <PhoneOutlined />,
      label: <Link to="/contact">Contact</Link>,
    },
    {
      key: "/login",
      icon: <LogoutOutlined />,
      label: "Sign Out",
      onClick: handleLogout,
      danger: true,
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Collapse Menu Button */}
      <CollapseMenuFrame collapsed={collapsed} onClick={toggleCollapsed}>
        <Tooltip title={collapsed ? "Expand Menu" : "Collapse Menu"}>
          {collapsed ? <CaretRightOutlined /> : <CaretLeftOutlined />}
        </Tooltip>
      </CollapseMenuFrame>

      {/* Sider (Sidebar) */}
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={toggleCollapsed}
        trigger={null}
        style={{
          backgroundColor: "white",
          overflow: "auto",
          height: "100vh",
          position: "fixed",
          left: 0,
          top: 0,
        }}
        width={240} // Fixed width
        collapsedWidth={80} // Collapsed width
        breakpoint="md" // Auto collapse on smaller screens
      >
        <LogoContainer collapsed={collapsed}>
          <LogoImage
            src={collapsed ? logo : textLogo}
            alt="Logo"
            collapsed={collapsed}
          />
        </LogoContainer>

        <MenuContainer>
          {/* Top Menu */}
          <Menu
            mode="inline"
            theme="light"
            selectedKeys={[location.pathname]}
            defaultOpenKeys={["sub1"]}
            items={menuItems}
          />

          {/* Bottom Menu */}
          <Menu
            mode="inline"
            theme="light"
            style={{ marginBottom: "20px" }}
            selectedKeys={null}
            items={bottomMenuItems}
          />
        </MenuContainer>
      </Sider>

      {/* Main Content */}
      <MainLayout collapsed={collapsed}>
        <Content style={{ overflow: "initial" }}>
          <ContentBackground>
            <Outlet />
          </ContentBackground>
        </Content>
        <Footer
          style={{
            textAlign: "center",
            backgroundColor: "var(--background-color)",
          }}
        >
          © {new Date().getFullYear()} NECTEC. All rights reserved.
        </Footer>
      </MainLayout>
    </Layout>
  );
};

export default PrivateLayout;
