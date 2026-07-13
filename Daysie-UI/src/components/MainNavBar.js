import { useNavigate } from "react-router-dom";
import logo from "./logo.png";
import "./Navbar.css";
import React from "react";
import { Container, Navbar, Nav, Button } from "react-bootstrap";

function MainNavBar() {
  const navigate = useNavigate();
  const authenticated = localStorage.getItem("isLoggedIn");

  const handleSignOut = () => {
    // Clear the token from localStorage
    localStorage.clear();
    // Redirect to the login page or any other desired page
    navigate("/login");
  };

  return (
    <Navbar expand="lg">
      <Container>
        <Navbar.Brand href="/home">
          <img
            src={logo}
            className="d-inline-block align-top"
            alt="Daysie logo"
          ></img>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
          <Nav className="mr-auto">
            <Nav.Link className="nav-links" href="/home">
              Home
            </Nav.Link>
            <Nav.Link className="nav-links" href="/configure">
              Configure
            </Nav.Link>
            <Nav.Link className="nav-links" href="/flowEditor">
              <span style={{ color: "orange" }}>Flow</span>
            </Nav.Link>
            {authenticated && (
              <Button variant="outline-warning" onClick={handleSignOut}>
                Sign Out
              </Button>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default MainNavBar;
