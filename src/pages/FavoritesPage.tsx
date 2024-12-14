import React from "react";
import { Container, Card, Row, Col } from "react-bootstrap";
import { useFavorites } from "../context/FavoritesContext";
import { Link } from "react-router-dom";
import { LuPlusCircle } from "react-icons/lu";
import { FaRegHeart } from "react-icons/fa";
import BackArrow from "../components/BackArrow";

const FavoritesPage: React.FC = () => {
  const { favorites, removeFavorite } = useFavorites();

  return (
    <Container className="fav-page mt-5">
      <BackArrow />
      <h2 className="text-center mb-5" style={{ fontSize: "2rem" }}>
        <FaRegHeart size={25} style={{ marginBottom: "13" }} /> Favorites
      </h2>
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
        <Row className="custom-favorites-row">
          {favorites.map((recipe) => (
            <Col
              key={recipe.id}
              xs={6}
              sm={6}
              md={4}
              lg={3}
              className="mb-4 custom-favorite-card"
            >
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
