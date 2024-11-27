import React from "react";
import { Link } from "react-router-dom";

const NotFound: React.FC = () => {
  return (
    <div className="d-flex flex-column align-items-center  justify-content-center ">
      <h1>404 - Not Found</h1>
      <p>The page you are looking for does not exist.</p>
      <Link to={"/"} replace>
        <span>Homepage</span>
      </Link>
    </div>
  );
};

export default NotFound;
