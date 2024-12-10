import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchRecipeDetails } from "../services/spoonacularApi";
import { Container, Spinner, Row, Col } from "react-bootstrap";
import DOMPurify from "dompurify";
import { IoIosTimer } from "react-icons/io";
import { IoPeople } from "react-icons/io5";
import { IoArrowBackCircleSharp } from "react-icons/io5";
import { FaHome } from "react-icons/fa";

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
  readyInMinutes: number;
  servings: number;
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
        <Spinner
          animation="grow"
          className="custom-spinner"
          style={{ color: "#dc5d4d" }}
        />
        <p>Loading recipe details...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="text-center mt-5">
        <p>{error}</p>
        <div
          className="home-icon mb-4"
          style={{
            cursor: "pointer",
          }}
          onClick={() => navigate("/")}
        >
          <FaHome
            size={45}
            style={{
              color: "#dc5d4d",
            }}
            className="home-icon"
          />
          <p>Return to Homepage</p>
        </div>
      </Container>
    );
  }

  return (
    <Container className="mt-5">
      <div
        className=" backicon mb-4"
        style={{ cursor: "pointer" }}
        onClick={() => navigate(-1)}
      >
        <IoArrowBackCircleSharp
          className="arrow-hover"
          size={45}
          style={{
            color: "#dc5d4d",
            transition: "transform 0.5s ease, color 0.3s ease",
            cursor: "pointer",
          }}
        />
      </div>
      <h2 className="text-center mb-4 fw-bold ">{recipe?.title}</h2>
      <Row>
        <Col md={5} className="mb-4 mb-md-0">
          <img
            src={recipe?.image}
            alt={recipe?.title}
            style={{
              width: "90%",
              height: "auto",
              borderRadius: "12px",
              objectFit: "cover",
            }}
          />
          <div className="mt-4">
            <Row className="text-center custom-left-margin">
              <Col>
                <h5>
                  <IoIosTimer
                    size={24}
                    style={{ color: "#dc5d4d", marginRight: "8px" }}
                  />
                  Total Time
                </h5>
                <p>{recipe?.readyInMinutes} minutes</p>
              </Col>
              <Col>
                <h5>
                  <IoPeople
                    size={24}
                    style={{ color: "#dc5d4d", marginRight: "8px" }}
                  />
                  Servings
                </h5>
                <p>{recipe?.servings}</p>
              </Col>
            </Row>
          </div>
        </Col>
        <Col md={7}>
          <h4>Ingredients:</h4>
          <ul>
            {recipe?.extendedIngredients.map((ingredient: Ingredient) => (
              <li key={ingredient.id}>
                {ingredient.original} ({ingredient.name})
              </li>
            ))}
          </ul>
          <h4 className="mt-4">Instructions:</h4>
          <div
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(
                recipe?.instructions || "No instructions provided."
              ),
            }}
          />
        </Col>
      </Row>
    </Container>
  );
};

export default RecipeDetailPage;
