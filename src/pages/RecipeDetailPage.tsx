import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchRecipeDetails } from "../services/spoonacularApi";
import { Container, Spinner, Row, Col, Button } from "react-bootstrap";
import { doc, updateDoc, arrayUnion, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase/firebase";
import DOMPurify from "dompurify";
import { IoIosTimer } from "react-icons/io";
import { IoPeople } from "react-icons/io5";
import { FaHome } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { RiShoppingBag4Line } from "react-icons/ri";
import BackArrow from "../components/BackArrow";

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

  const user = auth.currentUser;

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

  const addIngredientsToGroceryList = async () => {
    if (!user || !recipe) {
      toast.error("You must be logged in to save ingredients.");
      return;
    }

    const groceryDoc = doc(db, "groceryLists", user.uid);
    try {
      const docSnap = await getDoc(groceryDoc);

      if (docSnap.exists()) {
        await updateDoc(groceryDoc, {
          items: arrayUnion(
            ...recipe.extendedIngredients.map((ingredient) => ({
              id: ingredient.id,
              item: ingredient.original,
              checked: false,
            }))
          ),
        });
        toast.success(
          <>
            Ingredients added to your grocery list!{" "}
            <a href="/groceries" style={{ color: "#dc5d4d" }}>
              Go to Groceries
            </a>
          </>
        );
      } else {
        await setDoc(groceryDoc, {
          items: recipe.extendedIngredients.map((ingredient) => ({
            id: ingredient.id,
            item: ingredient.original,
            checked: false,
          })),
        });
        toast.success(
          <>
            Grocery list created and ingredients added!{" "}
            <a href="/groceries" style={{ color: "#dc5d4d" }}>
              Go to Groceries
            </a>
          </>
        );
      }
    } catch (error) {
      console.error("Error adding ingredients:", error);
      toast.error("Failed to add ingredients to groceries.");
    }
  };

  if (loading) {
    return (
      <Container
        className="text-center mt-5"
        style={{ maxWidth: "900px", margin: "0 auto" }}
      >
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
      <Container
        className="text-center mt-5"
        style={{ maxWidth: "900px", margin: "0 auto" }}
      >
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
    <Container className="mt-5" style={{ maxWidth: "940px", margin: "0 auto" }}>
      <BackArrow />
      <h2 className="text-center mb-4 fw-bold ">{recipe?.title}</h2>
      <Row>
        <Col
          md={5}
          className="mb-4 mb-md-0 d-flex flex-column align-items-center"
        >
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
          <div className="mt-4 w-100">
            <Row className="text-center justify-content-center">
              <Col xs={6} className="d-flex flex-column align-items-center">
                <IoIosTimer
                  size={24}
                  style={{ color: "#dc5d4d", marginBottom: "7px" }}
                />
                <h6>Total Time</h6>
                <p>{recipe?.readyInMinutes} minutes</p>
              </Col>
              <Col xs={6} className="d-flex flex-column align-items-center">
                <IoPeople
                  size={24}
                  style={{ color: "#dc5d4d", marginBottom: "7px" }}
                />
                <h6>Servings</h6>
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
          <Button
            className="mt-3"
            style={{
              backgroundColor: "#dc5d4d",
              borderColor: "#dc5d4d",
              marginLeft: 10,
            }}
            onClick={addIngredientsToGroceryList}
          >
            Add to <RiShoppingBag4Line size={24} style={{ marginTop: -6 }} />
          </Button>
          <h4 className="mt-4 ">Instructions:</h4>
          <div
            className="mb-4"
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(
                recipe?.instructions || "No instructions provided."
              ),
            }}
          />
        </Col>
      </Row>

      <ToastContainer />
    </Container>
  );
};

export default RecipeDetailPage;
