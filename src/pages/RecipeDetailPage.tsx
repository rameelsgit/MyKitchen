import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchRecipeDetails } from "../services/spoonacularApi";
import { Container, Button, Spinner } from "react-bootstrap";

interface Ingredient {
  id: number;
  original: string;
  name: string;
}

interface Recipe {
  title: string;
  image: string;
  extendedIngredients: Ingredient[];
  instructions: string;
}

const RecipeDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadRecipeDetails = async () => {
      try {
        const data = await fetchRecipeDetails(Number(id));
        setRecipe(data);
      } catch {
        setError("Failed to load recipe details.");
      } finally {
        setLoading(false);
      }
    };

    loadRecipeDetails();
  }, [id]);

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" />
        <p>Loading recipe details...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="text-center mt-5">
        <p>{error}</p>
        <Button onClick={() => navigate("/")}>Back to Home</Button>
      </Container>
    );
  }

  return (
    <Container className="mt-5">
      <Button onClick={() => navigate(-1)} className="mb-4">
        Go Back
      </Button>
      <h2>{recipe?.title}</h2>
      <img
        src={recipe?.image}
        alt={recipe?.title}
        style={{ width: "100%", maxHeight: "400px", objectFit: "cover" }}
        className="mb-4"
      />
      <h4>Ingredients:</h4>
      <ul>
        {recipe?.extendedIngredients.map((ingredient: Ingredient) => (
          <li key={ingredient.id}>
            {ingredient.original} ({ingredient.name})
          </li>
        ))}
      </ul>
      <h4>Instructions:</h4>
      <p>{recipe?.instructions || "No instructions provided."}</p>
    </Container>
  );
};

export default RecipeDetailPage;
