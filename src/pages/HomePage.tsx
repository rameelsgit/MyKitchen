import React, { useState } from "react";
import { fetchRecipesByIngredients } from "../services/SpoonacularAPI";
import { Container, Button, Form, Card, Row, Col } from "react-bootstrap";
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

  const handleGenerateRecipes = async () => {
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

  return (
    <>
      <header>
        <img src={cookingImage} alt="header" />
        <h1>MyKitchen</h1>
      </header>

      <Container className="mt-5">
        <h2>Generate Recipes Based on Ingredients</h2>
        <Form.Control
          type="text"
          placeholder="Enter ingredients (e.g., tomato, cheese)"
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
        />
        <Button
          onClick={handleGenerateRecipes}
          disabled={loading}
          className="mt-3"
        >
          {loading ? "Loading..." : "Generate Recipes"}
        </Button>

        {error && <p style={{ color: "red" }}>{error}</p>}

        {recipes.length > 0 && (
          <Row className="mt-4">
            {recipes.map((recipe) => (
              <Col key={recipe.id} sm={12} md={6} lg={4}>
                <Card>
                  <Card.Img
                    variant="top"
                    src={recipe.image}
                    alt={recipe.title}
                  />
                  <Card.Body>
                    <Card.Title>{recipe.title}</Card.Title>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </Container>
    </>
  );
};

export default HomePage;
