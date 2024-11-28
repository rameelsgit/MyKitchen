import React from "react";
import { useAuth } from "../context/AuthContext";
import { Container, Card, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom"; 
import { RiShoppingBag4Line } from "react-icons/ri";
import { FaRegHeart, FaUserEdit } from "react-icons/fa";
import "../assets/scss/styles.scss"; 

const ProfilePage: React.FC = () => {
  const { user } = useAuth();

  return (
    <Container className="mt-5">
      <h2 className="text-center">Profile Page</h2>
      {user ? (
        <div>
          <p className="text-center">
            Welcome, {user.displayName || user.email}!
          </p>
          <Row className="justify-content-center">
            <Col xs={12} sm={4} className="mb-4">
              <Card
                as={Link}
                to="/favorites"
                className="text-center minimalist-card square-card"
              >
                <Card.Body>
                  <FaRegHeart size={40} />
                  <h5 className="mt-3">Favorites</h5>
                </Card.Body>
              </Card>
            </Col>
            <Col xs={12} sm={4} className="mb-4">
              <Card
                as={Link}
                to="/edit-profile"
                className="text-center minimalist-card square-card"
              >
                <Card.Body>
                  <FaUserEdit size={40} />
                  <h5 className="mt-3">Edit Profile</h5>
                </Card.Body>
              </Card>
            </Col>
            <Col xs={12} sm={4} className="mb-4">
              <Card
                as={Link}
                to="/groceries"
                className="text-center minimalist-card square-card"
              >
                <Card.Body>
                  <RiShoppingBag4Line size={40} />
                  <h5 className="mt-3">Groceries</h5>
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

export default ProfilePage;
