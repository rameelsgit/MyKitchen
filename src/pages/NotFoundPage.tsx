import React from "react";
import { useNavigate } from "react-router-dom";
import { FaHome } from "react-icons/fa";
import { Container } from "react-bootstrap";

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Container className="text-center mt-5">
      <h1>404 - Not Found</h1>
      <p>The page you are looking for does not exist.</p>
      <div
        className="home-icon mb-4"
        style={{
          cursor: "pointer",
        }}
        onClick={() => navigate("/")}
      >
        <FaHome
          size={45}
          style={{
            color: "#dc5d4d",
          }}
          className="home-icon"
        />
        <p>Return to Homepage</p>
      </div>
    </Container>
  );
};

export default NotFound;
