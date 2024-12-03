import React, { useState, useRef } from "react";
import { fetchRecipesByIngredients } from "../services/spoonacularApi";
import {
  Container,
  Button,
  Form,
  Card,
  Row,
  Col,
  Spinner,
} from "react-bootstrap";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { useFavorites } from "../context/FavoritesContext";
import LoginModal from "../components/LoginModal";
import "../assets/scss/styles.scss";
import cookingImage from "../assets/images/cooking.png";
import { CgMoreR } from "react-icons/cg";

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
  const [offset, setOffset] = useState<number>(0);
  const [showLoadMore, setShowLoadMore] = useState<boolean>(false);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);

  const { favorites, addFavorite, showLoginModal, setShowLoginModal } =
    useFavorites();
  const resultsRef = useRef<HTMLDivElement>(null);

  const handleGenerateRecipes = async () => {
    if (ingredients.trim() === "") {
      setError("Please enter some ingredients.");
      return;
    }

    setLoading(true);
    setError("");
    setOffset(0);
    try {
      const results = await fetchRecipesByIngredients(ingredients, 12, 0);
      if (results.length === 0) {
        setError(
          "No recipes found. Please check your spelling or try different ingredients."
        );
        setShowLoadMore(false);
      } else {
        setRecipes(results);
        setShowLoadMore(true);
        setTimeout(() => {
          if (resultsRef.current) {
            resultsRef.current.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
          }
        }, 100);
      }
    } catch (error) {
      setError("Error fetching recipes. Please try again later.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = async () => {
    console.log("Loading more recipes...");
    setLoadingMore(true);

    setTimeout(async () => {
      try {
        const newRecipes = await fetchRecipesByIngredients(
          ingredients,
          12,
          offset
        );
        if (newRecipes.length === 0) {
          setShowLoadMore(false);
          setError("No more recipes available.");
        } else {
          setRecipes((prevRecipes) => [...prevRecipes, ...newRecipes]);
          setOffset((prevOffset) => prevOffset + 12);
        }
      } catch (error) {
        setError("Error fetching recipes. Please try again later.");
        console.error(error);
      } finally {
        setLoadingMore(false);
      }
    }, 1000);
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
      </Container>

      <div ref={resultsRef} style={{ marginTop: "40px" }}>
        {recipes.length > 0 && (
          <Row className="mt-4">
            {recipes.map((recipe, index) => {
              const isFavorite = favorites.some((fav) => fav.id === recipe.id);
              return (
                <Col key={`${recipe.id}-${index}`} sm={6} md={4} lg={2}>
                  <Card className="recipe-card">
                    <Card.Img
                      variant="top"
                      src={recipe.image}
                      alt={recipe.title}
                      className="recipe-image"
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

        {showLoadMore && recipes.length > 0 && (
          <div className="text-center mt-4">
            <span
              className="load-more-link"
              onClick={handleLoadMore}
              style={{
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
              }}
            >
              {loadingMore ? (
                <Spinner
                  animation="grow"
                  className="custom-spinner"
                  style={{ color: "#dc5d4d", marginRight: "8px" }}
                />
              ) : (
                <CgMoreR
                  style={{ marginRight: "8px", color: "#dc5d4d" }}
                  size={30}
                />
              )}
              Load More
            </span>
          </div>
        )}

        {!showLoadMore && recipes.length > 0 && !loadingMore && (
          <div className="text-center mt-4">
            <p>No more recipes available.</p>
          </div>
        )}
      </div>

      <LoginModal
        show={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />
    </>
  );
};

export default HomePage;
