import React from "react";
import { Layout, Button, Grid } from "antd";
import { Link, Outlet } from "react-router-dom";
import logo from "../../assets/logo.png";
import textLogo from "../../assets/logo-with-text.png";

const { Header, Content, Footer } = Layout;
const { useBreakpoint } = Grid;

const PublicLayout = () => {
  const screens = useBreakpoint();

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header
        style={{
          backgroundColor: "white",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <img
          src={screens.md ? textLogo : logo}
          alt="Logo"
          style={{ height: "40px" }}
        />
        <Link
          to="https://portal.daysie.io"
          target="_blank"
          rel="noreferrer noopen"
        >
          <Button type="primary">Go to portal</Button>
        </Link>
      </Header>
      <Content
        style={{ backgroundColor: "var(--background-color)", padding: "20px" }}
      >
        <Outlet />
      </Content>
      <Footer
        style={{
          backgroundColor: "var(--background-color)",
          textAlign: "center",
        }}
      >
        © {new Date().getFullYear()} NECTEC. All rights reserved.
      </Footer>
    </Layout>
  );
};

export default PublicLayout;
