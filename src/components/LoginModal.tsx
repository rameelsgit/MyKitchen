import React from "react";
import { Modal, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { PiBowlFoodDuotone } from "react-icons/pi";

interface LoginModalProps {
  show: boolean;
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ show, onClose }) => {
  const navigate = useNavigate();
  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>
          <PiBowlFoodDuotone
            style={{ marginRight: "20px", color: "#dc5d4d" }}
          />
          Log In to Favorite Recipes
        </Modal.Title>
      </Modal.Header>
      <Modal.Footer>
        <Button className="generate-btn" onClick={() => navigate("/login")}>
          Log In
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default LoginModal;
