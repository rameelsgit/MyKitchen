import React from "react";
import { Navbar, Nav, Container, NavDropdown } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { LuUserCircle2 } from "react-icons/lu";

const NavBar: React.FC = () => {
  const { isLoggedIn, logout } = useAuth();

  return (
    <Navbar bg="light" expand="lg">
      <Container>
        <Link to="/" className="navbar-brand">
          MyKitchen
        </Link>
        <Navbar.Toggle
          style={{
            borderColor: "white",
          }}
          aria-controls="basic-navbar-nav"
        />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto"></Nav>
          <Nav>
            {isLoggedIn ? (
              <NavDropdown
                title="Profile"
                id="profile-dropdown"
                style={{
                  fontSize: "0.9rem",
                  minWidth: "150px",
                  padding: "0.5rem 0",
                }}
              >
                <NavDropdown.Item
                  as={Link}
                  to="/dashboard"
                  style={{ fontSize: "0.9rem", padding: "0.25rem 1rem" }}
                >
                  Dashboard
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item
                  onClick={logout}
                  style={{ fontSize: "0.9rem", padding: "0.25rem 1rem" }}
                >
                  Logout
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              <Nav.Item>
                <Link to="/dashboard" className="nav-link">
                  <LuUserCircle2 size={32} />
                </Link>
              </Nav.Item>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
