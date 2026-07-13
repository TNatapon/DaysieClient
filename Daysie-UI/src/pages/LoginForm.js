import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button, Col, Container, Form } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";

function LoginForm() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    if (isLoggedIn) {
      navigate("/deviceToken");
    }
  }, [navigate]);

  const handleLoginClick = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(
        "https://dev.daysie.io/login",
        { username, password },
        { withCredentials: true }
      );
      if (response.status === 200) {
        localStorage.setItem("isLoggedIn", true);
        localStorage.setItem("exp", response.data.exp);
        alert("Login success");
        navigate("/deviceToken");
      } else {
        console.log("Unexpected status code:", response.status);
      }
    } catch (error) {
      console.log("Error:", error);
      alert("Login failed");
    }
  };

  return (
    <Container className="mt-4">
      <Col xs={12} md={6} lg={5} className="mx-auto bg-white p-3 rounded">
        <div className="text-center">
          <img src={logo} alt="daysie_logo" className="w-25 mb-2" />
          <div>
            <h5>
              Edge customization{" "}
              <span style={{ color: "#FFAF02" }}>made easy</span>
            </h5>
          </div>
        </div>
        <div className="text-Left">
          <h2>Login</h2>
          <p className="text-secondary">
            Access Daysie portal using your username and password.
          </p>
        </div>

        <Form onSubmit={handleLoginClick}>
          <Form.Group className="mb-3" controlId="formBasicUsername">
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{ border: "none", backgroundColor: "#F5F5F5" }}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ border: "none", backgroundColor: "#F5F5F5" }}
            />
          </Form.Group>

          <Form.Group className="mb-3 d-flex justify-content-end">
            <Form.Text className="text-muted">
              <Link
                to="/forgot-password"
                style={{ color: "#FFAF02", fontWeight: "bold" }}
              >
                Forgot Password?
              </Link>
            </Form.Text>
          </Form.Group>

          <Button
            variant="primary"
            type="submit"
            className="w-100"
            style={{ backgroundColor: "#FFAF02", border: "none" }}
          >
            Login
          </Button>

          <Form.Group className="mt-3 d-flex justify-content-center">
            <p className="mb-0 me-1">Don't have an account?</p>
            <p className="mb-0">
              <Link
                to="/register"
                style={{ color: "#FFAF02", fontWeight: "bold" }}
              >
                Create an Account
              </Link>
            </p>
          </Form.Group>
        </Form>
      </Col>
    </Container>
  );
}

export default LoginForm;
