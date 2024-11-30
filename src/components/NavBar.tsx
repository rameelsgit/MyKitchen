import React from "react";
import { Navbar, Nav, Container, NavDropdown } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { LuUserCircle2 } from "react-icons/lu";

const NavBar: React.FC = () => {
  const { isLoggedIn, logout } = useAuth();

  return (
    <Navbar bg="light" expand="lg">
      <Container>
        <Link to="/" className="navbar-brand">
          MyKitchen
        </Link>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {/* <Nav.Item>
              <Link to="/recipes" className="nav-link">
                Recipes
              </Link>
            </Nav.Item> */}
          </Nav>
          <Nav>
            {isLoggedIn ? (
              <NavDropdown title="Profile" id="profile-dropdown">
                <NavDropdown.Item as={Link} to="/profile">
                  View Dashboard
                </NavDropdown.Item>
                {/* <NavDropdown.Item as={Link} to="/favorites">
                  My Favorite Recipes
                </NavDropdown.Item> */}
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={logout}>Logout</NavDropdown.Item>
              </NavDropdown>
            ) : (
              <Nav.Item>
                <Link to="/profile" className="nav-link">
                  <LuUserCircle2 size={35} />
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
