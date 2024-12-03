import axios from "axios";

const API_KEY = import.meta.env.VITE_SPOONACULAR_API_KEY;

export const fetchRecipesByIngredients = async (
  ingredients: string,
  number: number = 12,
  offset: number = 0
) => {
  try {
    const response = await axios.get(
      `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${ingredients}&number=${number}&offset=${offset}&apiKey=${API_KEY}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching recipes:", error);
    throw new Error("Failed to fetch recipes");
  }
};

export const fetchRecipeDetails = async (recipeId: number) => {
  try {
    const response = await axios.get(
      `https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=${API_KEY}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching recipe details:", error);
    throw new Error("Failed to fetch recipe details");
  }
};
