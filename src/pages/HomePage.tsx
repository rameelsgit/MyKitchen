import React, { useState } from "react";
import { fetchRecipesByIngredients } from "../services/spoonacularApi";
import { Container, Button, Form, Card, Row, Col } from "react-bootstrap";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { useFavorites } from "../context/FavoritesContext";
import LoginModal from "../components/LoginModal";
import "../assets/scss/styles.scss";
import cookingImage from "../assets/images/cooking.png";

interface Recipe {
  id: number;
  title: string;
  image: string;
}

const HomePage: React.FC = () => {
  const [ingredients, setIngredients] = useState<string>("");
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const { favorites, addFavorite, showLoginModal, setShowLoginModal } =
    useFavorites();

  const handleGenerateRecipes = async () => {
    if (ingredients.trim() === "") return;
    setLoading(true);
    setError("");
    try {
      const results = await fetchRecipesByIngredients(ingredients);
      setRecipes(results);
    } catch (error) {
      setError("Error fetching recipes. Please try again later.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleGenerateRecipes();
    }
  };

  const handleAddFavorite = (recipe: Recipe) => {
    if (!favorites) {
      setShowLoginModal(true);
    } else {
      addFavorite(recipe);
    }
  };

  return (
    <>
      <header className="text-center">
        <img src={cookingImage} alt="header" />
        <h1>MyKitchen</h1>
      </header>

      <Container className="mt-5 text-center fade-in">
        <h2>Generate Recipes Based on Ingredients</h2>
        <Form onKeyDown={handleKeyDown}>
          <Form.Control
            type="text"
            placeholder="Enter ingredients (e.g., tomato, cheese)"
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
            className="search-bar"
          />
          <Button
            onClick={handleGenerateRecipes}
            disabled={loading}
            className="mt-3 generate-btn"
          >
            {loading ? "Loading..." : "Generate Recipes"}
          </Button>
        </Form>

        {error && <p style={{ color: "red" }}>{error}</p>}

        {recipes.length > 0 && (
          <Row className="mt-4">
            {recipes.map((recipe) => {
              const isFavorite = favorites.some((fav) => fav.id === recipe.id);
              return (
                <Col key={recipe.id} sm={12} md={6} lg={4}>
                  <Card>
                    <Card.Img
                      variant="top"
                      src={recipe.image}
                      alt={recipe.title}
                    />
                    <Card.Body>
                      <Card.Title>{recipe.title}</Card.Title>
                      {isFavorite ? (
                        <FaHeart
                          className="favorite-icon"
                          size={24}
                          style={{ cursor: "pointer", color: "#dc5d4d" }}
                        />
                      ) : (
                        <FaRegHeart
                          className="favorite-icon"
                          size={24}
                          onClick={() => handleAddFavorite(recipe)}
                          style={{ cursor: "pointer", color: "#dc5d4d" }}
                        />
                      )}
                    </Card.Body>
                  </Card>
                </Col>
              );
            })}
          </Row>
        )}
      </Container>
      <LoginModal
        show={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />
    </>
  );
};

export default HomePage;
