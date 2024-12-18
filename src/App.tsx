import { ToastContainer } from "react-toastify";
import React from "react";
import { Routes, Route } from "react-router-dom";
import { Container } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { AuthProvider } from "./context/AuthContext";
import { FavoritesProvider } from "./context/FavoritesContext";
import NavbarComponent from "./components/NavBar";
import HomePage from "./pages/HomePage";
import NotFound from "./pages/NotFoundPage";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import FavoritesPage from "./pages/FavoritesPage";
import RecipeDetailPage from "./pages/RecipeDetailPage";
import PrivateRoute from "./components/PrivateRoute";
import "./assets/scss/styles.scss";
import EditProfilePage from "./pages/EditProfilePage";
import CalendarPage from "./pages/CalendarPage";
import GroceriesPage from "./pages/GroceriesPage";
import { PiButterflyBold } from "react-icons/pi";
import { BiCopyright } from "react-icons/bi";

const App: React.FC = () => {
  return (
    <AuthProvider>
      <FavoritesProvider>
        <div className="d-flex flex-column min-vh-100">
          <NavbarComponent />
          <Container fluid className="flex-grow-1 p-0">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/favorites" element={<FavoritesPage />} />
              <Route path="/recipe/:id" element={<RecipeDetailPage />} />
              <Route path="/groceries" element={<GroceriesPage />} />
              <Route
                path="/edit-profile"
                element={<PrivateRoute element={<EditProfilePage />} />}
              />
              <Route
                path="/calendar"
                element={<PrivateRoute element={<CalendarPage />} />}
              />
              <Route
                path="/recipe/:recipeTitle"
                element={<RecipeDetailPage />}
              />
              <Route path="*" element={<NotFound />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route
                path="/dashboard"
                element={<PrivateRoute element={<DashboardPage />} />}
              />
            </Routes>
          </Container>

          <footer className="bg-light text-center py-3">
            <Container>
              <BiCopyright style={{ marginBottom: "3" }} color="#dc5d4d" />{" "}
              {new Date().getFullYear()} MyKitchen{" "}
              <PiButterflyBold
                color="#dc5d4d"
                size={23}
                style={{ marginBottom: "5" }}
              />
            </Container>
          </footer>
        </div>
        <ToastContainer position="top-right" autoClose={5000} />
      </FavoritesProvider>
    </AuthProvider>
  );
};

export default App;
