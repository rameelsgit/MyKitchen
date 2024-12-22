import React from "react";
import { Modal, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { PiBowlFoodDuotone } from "react-icons/pi";

interface LoginModalProps {
  show: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({
  show,
  onClose,
  onLoginSuccess,
}) => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/login");
    onLoginSuccess();
  };

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
        <Button className="generate-btn" onClick={handleLogin}>
          Log In
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default LoginModal;
