import React, { useState } from "react";
import { Container, Col, Form, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function RegisterPage() {
  const navigate = useNavigate();

  const [values, setValues] = useState({
    name: "",
    email: "",
    username: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "https://dev.daysie.io/register",
        values
      );
      if (response.status === 200) {
        console.log("Registration successful");
        alert("Registration successful.");
        navigate("/login");
      } else {
        console.log("Unexpected status code:", response.status);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <Container className="mt-4">
      <Col xs={12} md={6} lg={5} className="mx-auto bg-white p-5 rounded">
        <div className="text-left">
          <h2>Register</h2>
          <p className="text-secondary">
            Fill the form below to create a new account.
          </p>
        </div>

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formRegisName">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={values.name}
              placeholder="Enter your name"
              onChange={handleChange}
              style={{ border: "none", backgroundColor: "#F5F5F5" }}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formRegisEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={values.email}
              placeholder="Enter your email"
              onChange={handleChange}
              style={{ border: "none", backgroundColor: "#F5F5F5" }}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formRegisUsername">
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              name="username"
              value={values.username}
              placeholder="Enter your username"
              onChange={handleChange}
              style={{ border: "none", backgroundColor: "#F5F5F5" }}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formRegisPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              name="password"
              value={values.password}
              placeholder="Enter your password"
              onChange={handleChange}
              style={{ border: "none", backgroundColor: "#F5F5F5" }}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formRegisPolicy">
            <Form.Check
              type="checkbox"
              label={
                <div className="font-weight-bold">
                  I have read and agree to the{" "}
                  <Link
                    to="/privacy-policy"
                    style={{ color: "black", fontWeight: "bold" }}
                  >
                    <u>Privacy Policy</u>
                  </Link>{" "}
                  and{" "}
                  <Link
                    to="/terms-of-service"
                    style={{ color: "black", fontWeight: "bold" }}
                  >
                    <u>Terms of Service</u>
                  </Link>
                </div>
              }
              style={{ border: "none" }}
              required
            />
          </Form.Group>

          <Button
            variant="primary"
            type="submit"
            className="w-100"
            style={{ backgroundColor: "#FFAF02", border: "none" }}
          >
            Register
          </Button>

          <hr className="hr mt-4" />

          <Form.Group className="mt-3 d-flex justify-content-center">
            <p className="mb-0">Already have an account? </p>
            <p className="mb-0 ps-1 ">
              <Link
                to="/login"
                style={{ fontWeight: "bold", color: "#FFAF02" }}
              >
                Login
              </Link>
            </p>
          </Form.Group>
        </Form>
      </Col>
    </Container>
  );
}

export default RegisterPage;
