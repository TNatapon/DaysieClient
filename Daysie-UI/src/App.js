import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginForm from "./pages/LoginForm.js";
import DeviceTokenPage from "./pages/DeviceToken.js";
import DashboardPage from "./pages/Dashboard.js";
import RecipeConfigPage from "./pages/RecipeConfig.js";
import AdvancedSettingPage from "./pages/AdvanceSetting.js";
import FlowEditorPage from "./pages/FlowEditor.js";
import RegisterPage from "./pages/Register.js";
import PrivateLayout from "./components/layouts/PrivateLayout.js";
import PublicLayout from "./components/layouts/PublicLayout.js";
import PrivateRoute from "./components/routes/PrivateRoute.js";
import ResetPassword from "./pages/resetPassword.js";
import NotFoundPage from "./pages/NotFound.js";

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <PrivateRoute>
              <PrivateLayout />
            </PrivateRoute>
          }
        >
          <Route path="overview" element={<DashboardPage />} />
          <Route path="deviceToken" element={<DeviceTokenPage />} />
          <Route path="configure" element={<RecipeConfigPage />} />
          <Route path="advancedSetting" element={<AdvancedSettingPage />} />
          <Route path="flowEditor" element={<FlowEditorPage />} />
        </Route>
        <Route path="/" element={<PublicLayout />}>
          <Route path="login" element={<LoginForm />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="forgot-password" element={<ResetPassword />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}

export default App;
