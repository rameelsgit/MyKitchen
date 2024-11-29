import React from "react";
import { Routes, Route } from "react-router-dom";
import { Container } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { AuthProvider } from "./context/AuthContext";
import NavbarComponent from "./components/NavBar";
import HomePage from "./pages/HomePage";
import NotFound from "./pages/NotFoundPage";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import { ToastContainer } from "react-toastify";
import PrivateRoute from "./components/PrivateRoute";
import ProfilePage from "./pages/ProfilePage";
import "./assets/scss/styles.scss";

const App: React.FC = () => {
  return (
    <AuthProvider>
      <div className="d-flex flex-column min-vh-100">
        <NavbarComponent />
        <Container fluid className="flex-grow-1 p-0 ">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="*" element={<NotFound />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/profile"
              element={<PrivateRoute element={<ProfilePage />} />}
            />
          </Routes>
        </Container>

        <footer className="bg-light text-center py-3">
          <Container>© {new Date().getFullYear()} MyKitchen</Container>
        </footer>
      </div>
      <ToastContainer position="top-right" autoClose={5000} />
    </AuthProvider>
  );
};

export default App;
