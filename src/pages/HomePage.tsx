import React, { useState, useRef, useEffect } from "react";
import { fetchRecipesByIngredients } from "../services/spoonacularApi";
import { Container, Form, Card, Row, Col, Spinner } from "react-bootstrap";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { useFavorites } from "../context/hooks/useFavorites";
import LoginModal from "../components/LoginModal";
import "../assets/scss/styles.scss";
import cookingImage from "../assets/images/cooking.png";
import { CgMoreR } from "react-icons/cg";
import { useAuth } from "../context/useAuth";
import { Link } from "react-router-dom";

interface Recipe {
  id: number;
  title: string;
  image: string;
}

const HomePage: React.FC = () => {
  const {
    favorites,
    addFavorite,
    removeFavorite,
    showLoginModal,
    setShowLoginModal,
  } = useFavorites();
  const { isLoggedIn } = useAuth();

  const [ingredients, setIngredients] = useState<string>(() => {
    const lastSearch = localStorage.getItem("lastSearch") || "";
    return lastSearch;
  });
  const [recipes, setRecipes] = useState<Recipe[]>(() => {
    const savedRecipes = localStorage.getItem("lastResults");
    return savedRecipes ? JSON.parse(savedRecipes) : [];
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [offset, setOffset] = useState<number>(recipes.length);
  const [showLoadMore, setShowLoadMore] = useState<boolean>(recipes.length > 0);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (recipes.length > 0 && resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [recipes.length]);

  const handleGenerateRecipes = async () => {
    if (ingredients.trim() === "") {
      setError("Please enter some ingredients.");
      return;
    }

    setLoading(true);
    setError("");
    setOffset(12);
    setTimeout(async () => {
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
          localStorage.setItem("lastSearch", ingredients);
          localStorage.setItem("lastResults", JSON.stringify(results));
          setTimeout(() => scrollToResults(), 100);
        }
      } catch (error) {
        setError("Error fetching recipes. Please try again later.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    }, 500);
  };

  const handleLoadMore = async () => {
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
          const updatedRecipes = [...recipes, ...newRecipes];
          setRecipes(updatedRecipes);
          localStorage.setItem("lastResults", JSON.stringify(updatedRecipes));
          setOffset((prevOffset) => prevOffset + 12);
        }
      } catch (error) {
        setError("Error fetching more recipes. Please try again later.");
        console.error(error);
      } finally {
        setLoadingMore(false);
      }
    }, 1000);
  };

  const scrollToResults = () => {
    if (resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleFavoriteToggle = (recipe: Recipe) => {
    if (!isLoggedIn) {
      setShowLoginModal(true);
      return;
    }

    const isFavorite = favorites.some((fav) => fav.id === recipe.id);

    if (isFavorite) {
      removeFavorite(recipe.id);
    } else {
      addFavorite(recipe);
    }
  };

  const handleLoginSuccess = () => {
    setShowLoginModal(false);
    if (ingredients.trim() !== "") {
      handleGenerateRecipes();
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
        <Form
          onSubmit={(e) => {
            e.preventDefault();
            handleGenerateRecipes();
          }}
        >
          <Form.Control
            type="text"
            placeholder="Enter ingredients (e.g., tomato, cheese)"
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
            className="search-bar"
          />
          <button
            type="submit"
            disabled={loading}
            className="mt-3 generate-btn btn btn-success"
          >
            {loading ? "Loading..." : "Generate Recipes"}
          </button>
        </Form>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </Container>

      <div ref={resultsRef} style={{ marginTop: "40px" }}>
        {recipes.length > 0 && (
          <Row className="mt-4 g-4">
            {recipes.map((recipe) => {
              const isFavorite = favorites.some((fav) => fav.id === recipe.id);
              return (
                <Col key={recipe.id} xs={6} sm={6} md={4} lg={2}>
                  <Card className="recipe-card text-center">
                    <Link
                      to={`/recipe/${recipe.id}`}
                      style={{ textDecoration: "none" }}
                    >
                      <Card.Img
                        variant="top"
                        src={recipe.image}
                        alt={recipe.title}
                        className="recipe-image"
                      />
                      <Card.Body>
                        <Card.Title style={{ color: "black" }}>
                          {recipe.title}
                        </Card.Title>
                      </Card.Body>
                    </Link>
                    <div className="favorite-icon-container">
                      {isFavorite ? (
                        <FaHeart
                          className="favorite-icon"
                          size={24}
                          onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            handleFavoriteToggle(recipe);
                          }}
                          style={{ cursor: "pointer", color: "#dc5d4d" }}
                        />
                      ) : (
                        <FaRegHeart
                          className="favorite-icon"
                          size={24}
                          onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            handleFavoriteToggle(recipe);
                          }}
                          style={{ cursor: "pointer", color: "#dc5d4d" }}
                        />
                      )}
                    </div>
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
        onLoginSuccess={handleLoginSuccess}
      />
    </>
  );
};

export default HomePage;
