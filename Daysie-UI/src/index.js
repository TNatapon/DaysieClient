import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { ConfigProvider } from "antd";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.esm.min";

import App from "./App";

const root = createRoot(document.getElementById("root"));

root.render(
  <ConfigProvider theme={{ token: { colorPrimary: "#ffaf02" } }}>
    <App />
  </ConfigProvider>
);
