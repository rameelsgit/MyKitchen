import React from "react";
import { useNavigate } from "react-router-dom";
import { IoArrowBackCircleSharp } from "react-icons/io5";

const BackArrow: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div
      className="backicon mb-3"
      style={{ cursor: "pointer" }}
      onClick={() => navigate(-1)}
    >
      <IoArrowBackCircleSharp
        className="arrow-hover"
        size={45}
        style={{
          color: "#dc5d4d",
          transition: "transform 0.5s ease, color 0.3s ease",
          cursor: "pointer",
        }}
      />
    </div>
  );
};

export default BackArrow;
