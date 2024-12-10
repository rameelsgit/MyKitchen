import React from "react";
import { Container, Card, Row, Col } from "react-bootstrap";
import { useFavorites } from "../context/FavoritesContext";
import { Link } from "react-router-dom";
import { LuPlusCircle } from "react-icons/lu";

const FavoritesPage: React.FC = () => {
  const { favorites, removeFavorite } = useFavorites();

  return (
    <Container className="mt-5">
      <h2>Your Favorites</h2>
      {favorites.length === 0 ? (
        <div>
          <p>You have no favorite recipes yet!</p>
          <p>
            Explore & generate recipes to add to the collection &nbsp;&nbsp;
            <Link to="/" style={{ textDecoration: "none", color: "#4cae4c" }}>
              <LuPlusCircle size={36} />
            </Link>
          </p>
        </div>
      ) : (
        <Row>
          {favorites.map((recipe) => (
            <Col key={recipe.id} sm={6} md={4} lg={2} className="mb-4">
              <Card>
                <Link
                  to={`/recipe/${recipe.id}`}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <Card.Img
                    variant="top"
                    src={recipe.image}
                    alt={recipe.title}
                  />
                  <Card.Body>
                    <Card.Title>{recipe.title}</Card.Title>
                  </Card.Body>
                </Link>
                <button
                  onClick={() => removeFavorite(recipe.id)}
                  style={{
                    cursor: "pointer",
                    color: "#dc5d4d",
                    border: "none",
                    background: "none",
                  }}
                >
                  Remove
                </button>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default FavoritesPage;
