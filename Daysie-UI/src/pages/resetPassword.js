import { Button, Col, Container, Form } from "react-bootstrap";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate(); // Initialize navigate

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(email);

    // axios
    //   .post("https://dev.daysie.io/register", { email }) // Wrap email in an object
    //   .then((res) => {
    //     if (res.status === 200) {
    //       console.log("Registration successful");
    //       alert("Registration successful.");
    //       navigate("/login"); // Navigate to the login page
    //     } else {
    //       console.log("Unexpected status code:", res.status);
    //     }
    //   })
    //   .catch((err) => {
    //     console.error("Error:", err);
    //   });
  };

  return (
    <Container className="mt-4">
      <Col xs={12} md={6} lg={5} className="mx-auto bg-white p-5 rounded">
        <div className="text-left">
          <h2>Reset Password</h2>
          <p className="text-muted">
            If you forgot your password, well, then we’ll email you instructions
            to reset your password.
          </p>
        </div>

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formResetEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter your email"
              onChange={(e) => setEmail(e.target.value)}
              style={{ border: "none", backgroundColor: "#F5F5F5" }}
              required
            />
          </Form.Group>

          <Button
            variant="primary"
            type="submit"
            className="w-100"
            style={{ backgroundColor: "#FFAF02", border: "none" }}
          >
            Send reset link
          </Button>
        </Form>
      </Col>
    </Container>
  );
};

export default ResetPassword;
