import React from "react";
import { useAuth } from "../context/AuthContext";
import { Container, Card, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import { RiShoppingBag4Line } from "react-icons/ri";
import { FaRegHeart, FaUserEdit } from "react-icons/fa";
import { BsCalendar3 } from "react-icons/bs";
import "../assets/scss/styles.scss";
import { MdDashboardCustomize } from "react-icons/md";

const DashboardPage: React.FC = () => {
  const { user } = useAuth();

  return (
    <Container className="mt-5">
      <h2 className="text-center mb-4">
        <MdDashboardCustomize size={35} />
      </h2>
      {user ? (
        <div>
          <p className="text-center mb-4">
            Welcome To Your Personal Dashboard {user.displayName || user.email}!
          </p>
          <Row className="justify-content-center">
            <Col xs={6} md={6} lg={3} className="mb-4">
              <Card
                as={Link}
                to="/favorites"
                className="text-center minimalist-card square-card shadow-sm"
                style={{ height: "180px", borderRadius: "10px" }}
              >
                <Card.Body className="d-flex flex-column align-items-center justify-content-center">
                  <FaRegHeart size={45} />
                  <h5 className="mt-3">Favorites</h5>
                </Card.Body>
              </Card>
            </Col>
            <Col xs={6} md={6} lg={3} className="mb-4">
              <Card
                as={Link}
                to="/groceries"
                className="text-center minimalist-card square-card shadow-sm"
                style={{ height: "180px", borderRadius: "10px" }}
              >
                <Card.Body className="d-flex flex-column align-items-center justify-content-center">
                  <RiShoppingBag4Line size={45} />
                  <h5 className="mt-3">Groceries</h5>
                </Card.Body>
              </Card>
            </Col>
            <Col xs={6} md={6} lg={3} className="mb-4">
              <Card
                as={Link}
                to="/calendar"
                className="text-center minimalist-card square-card shadow-sm"
                style={{ height: "180px", borderRadius: "10px" }}
              >
                <Card.Body className="d-flex flex-column align-items-center justify-content-center">
                  <BsCalendar3 size={45} />
                  <h5 className="mt-3">Calendar</h5>
                </Card.Body>
              </Card>
            </Col>
            <Col xs={6} md={6} lg={3} className="mb-4">
              <Card
                as={Link}
                to="/edit-profile"
                className="text-center minimalist-card square-card shadow-sm"
                style={{ height: "180px", borderRadius: "10px" }}
              >
                <Card.Body className="d-flex flex-column align-items-center justify-content-center">
                  <FaUserEdit size={45} />
                  <h5 className="mt-3">Edit Profile</h5>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </Container>
  );
};

export default DashboardPage;
